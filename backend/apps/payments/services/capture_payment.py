from django.db import transaction
from django.utils import timezone
from apps.payments.models.payment import Payment
from apps.payments.models.deposit_ledger import DepositLedgerEntry
from apps.payments.constants.choices import PaymentStatus, AllocationComponent, DepositEntryType
from apps.orders.services.confirm_order import confirm_order_payment_received
from apps.rentals.services.create_contract import create_rental_contract_for_order


@transaction.atomic
def capture_successful_payment(payment: Payment) -> Payment:
    """
    Idempotently capture payment after confirmed gateway webhook or COD delivery.
    """
    payment = Payment.objects.select_for_update().get(id=payment.id)
    if payment.status == PaymentStatus.PAID:
        return payment

    payment.status = PaymentStatus.PAID
    payment.paid_at = timezone.now()
    payment.save(update_fields=["status", "paid_at", "updated_at"])

    # 1. Update order
    if payment.order:
        confirm_order_payment_received(payment.order)

        # 2. If order has rental, create RentalContract if not existing
        if payment.order.subtotal_rent_vnd > 0 and not hasattr(payment.order, "rental_contract"):
            contract = create_rental_contract_for_order(payment.order)
            payment.rental_contract = contract
            payment.save(update_fields=["rental_contract", "updated_at"])

            # 3. Create DepositLedgerEntry(HELD)
            deposit_alloc = payment.allocations.filter(component=AllocationComponent.DEPOSIT).first()
            if deposit_alloc and deposit_alloc.amount_vnd > 0:
                DepositLedgerEntry.objects.create(
                    rental_contract=contract,
                    entry_type=DepositEntryType.HELD,
                    amount_vnd=deposit_alloc.amount_vnd,
                    payment_allocation=deposit_alloc,
                    note="Tạm giữ cọc tiền thuê cây khi đơn hàng thanh toán thành công",
                )

    return payment
