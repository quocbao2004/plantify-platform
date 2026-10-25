from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.rentals.models.contract import RentalContract
from apps.payments.models.payment import Payment
from apps.payments.constants.choices import RefundStatus


class Refund(UUIDTimeStampedModel):
    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        related_name="refunds",
    )
    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="refunds",
    )
    amount_vnd = models.PositiveBigIntegerField(verbose_name="Số tiền hoàn (VNĐ)")
    reason = models.TextField(verbose_name="Lý do hoàn tiền")
    status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.PENDING,
        db_index=True,
    )
    provider_refund_id = models.CharField(max_length=150, blank=True, null=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments_refunds"
        verbose_name = "Khoản hoàn tiền"
        verbose_name_plural = "Khoản hoàn tiền"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Refund #{self.id} - {self.amount_vnd:,}₫ ({self.get_status_display()})"
