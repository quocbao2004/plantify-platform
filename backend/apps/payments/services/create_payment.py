import uuid
from django.db import transaction
from apps.orders.models.order import Order
from apps.payments.models.payment import Payment
from apps.payments.models.payment_allocation import PaymentAllocation
from apps.payments.constants.choices import PaymentMethod, PaymentPurpose, PaymentStatus, AllocationComponent


@transaction.atomic
def create_order_payment(order: Order, method: str = PaymentMethod.COD) -> Payment:
    """
    Create Payment record with detailed financial allocations (revenue vs custody deposit).
    """
    idempotency_key = f"PAY-{order.order_code}"
    payment, created = Payment.objects.get_or_create(
        idempotency_key=idempotency_key,
        defaults={
            "order": order,
            "purpose": PaymentPurpose.CHECKOUT,
            "amount_vnd": order.payable_total_vnd,
            "method": method,
            "status": PaymentStatus.PENDING,
        },
    )

    if created:
        allocations = []
        if order.subtotal_sale_vnd > 0:
            allocations.append(PaymentAllocation(payment=payment, component=AllocationComponent.SALE, amount_vnd=order.subtotal_sale_vnd))
        if order.subtotal_rent_vnd > 0:
            allocations.append(PaymentAllocation(payment=payment, component=AllocationComponent.RENT_FEE, amount_vnd=order.subtotal_rent_vnd))
        if order.deposit_total_vnd > 0:
            allocations.append(PaymentAllocation(payment=payment, component=AllocationComponent.DEPOSIT, amount_vnd=order.deposit_total_vnd))
        if order.shipping_fee_vnd > 0:
            allocations.append(PaymentAllocation(payment=payment, component=AllocationComponent.SHIPPING, amount_vnd=order.shipping_fee_vnd))

        PaymentAllocation.objects.bulk_create(allocations)

    return payment
