from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.models.order_item import OrderItem
from apps.payments.models.payment import Payment
from apps.payments.constants.choices import AllocationComponent


class PaymentAllocation(UUIDTimeStampedModel):
    """
    Sub-ledger allocating parts of a payment into business buckets:
    SALE (revenue), RENT_FEE (revenue), DEPOSIT (custody liability, NOT revenue), SHIPPING, etc.
    """
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name="allocations",
    )
    component = models.CharField(
        max_length=20,
        choices=AllocationComponent.choices,
        db_index=True,
    )
    amount_vnd = models.PositiveBigIntegerField(default=0)
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payment_allocations",
    )

    class Meta:
        db_table = "payments_payment_allocations"
        verbose_name = "Phân bổ dòng tiền thanh toán"
        verbose_name_plural = "Phân bổ dòng tiền thanh toán"

    def __str__(self):
        return f"{self.get_component_display()}: {self.amount_vnd:,}₫"
