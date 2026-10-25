from django.db import transaction
from django.db.models import Sum
from apps.payments.models.payment import Payment
from apps.payments.models.refund import Refund
from apps.payments.constants.choices import RefundStatus, PaymentStatus
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def request_refund_transaction(payment: Payment, amount_vnd: int, reason: str = "") -> Refund:
    """Request a refund ensuring sum of refunds does not exceed paid amount."""
    payment = Payment.objects.select_for_update().get(id=payment.id)
    if payment.status != PaymentStatus.PAID:
        raise BusinessRuleError("Không thể hoàn tiền cho giao dịch chưa thanh toán.")

    already_refunded = (
        payment.refunds.filter(status__in=[RefundStatus.PENDING, RefundStatus.SUCCESS])
        .aggregate(total=Sum("amount_vnd"))["total"]
        or 0
    )

    if already_refunded + amount_vnd > payment.amount_vnd:
        raise BusinessRuleError("Tổng số tiền hoàn vượt quá giá trị thanh toán gốc.")

    refund = Refund.objects.create(
        payment=payment,
        rental_contract=payment.rental_contract,
        amount_vnd=amount_vnd,
        reason=reason,
        status=RefundStatus.PENDING,
    )
    return refund
