from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .transaction import Transaction
from apps.accounts.models import User


class Refund(UUIDTimeStampedModel):
    """
    Refund model for processing refunds on transactions.
    """
    class RefundStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ xét duyệt hoàn tiền"
        APPROVED = "APPROVED", "Đã duyệt hoàn tiền"
        REJECTED = "REJECTED", "Từ chối hoàn tiền"
        COMPLETED = "COMPLETED", "Đã hoàn tất thanh toán tiền"

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name="refunds",
        verbose_name="Giao dịch gốc",
    )
    refund_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã hoàn tiền",
    )
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        verbose_name="Số tiền hoàn lại",
    )
    reason = models.TextField(verbose_name="Lý do hoàn tiền")
    status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái hoàn tiền",
    )
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="processed_refunds",
        verbose_name="Người xét duyệt / xử lý",
    )
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời điểm xử lý")
    notes = models.TextField(blank=True, verbose_name="Ghi chú xử lý")

    class Meta:
        db_table = "refunds"
        verbose_name = "Yêu cầu hoàn tiền"
        verbose_name_plural = "Yêu cầu hoàn tiền"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.refund_code} - {self.amount:,.0f} VND ({self.get_status_display()})"
