from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.models import User


class PurchaseOrder(UUIDTimeStampedModel):
    """
    PurchaseOrder model for direct plant purchases.
    """
    class OrderStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ xử lý"
        PAID = "PAID", "Đã thanh toán"
        PROCESSING = "PROCESSING", "Đang xử lý đóng gói"
        DELIVERING = "DELIVERING", "Đang giao hàng"
        COMPLETED = "COMPLETED", "Đã hoàn thành"
        CANCELLED = "CANCELLED", "Đã hủy"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="purchase_orders",
        verbose_name="Khách hàng",
    )
    order_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã đơn hàng",
    )
    total_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Tổng tiền đơn hàng",
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái",
    )
    shipping_address = models.TextField(verbose_name="Địa chỉ nhận hàng")
    recipient_name = models.CharField(max_length=255, verbose_name="Tên người nhận")
    recipient_phone = models.CharField(max_length=20, verbose_name="Số điện thoại nhận hàng")
    notes = models.TextField(blank=True, verbose_name="Ghi chú đơn hàng")

    class Meta:
        db_table = "purchase_orders"
        verbose_name = "Đơn mua cây"
        verbose_name_plural = "Đơn mua cây"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_code} - {self.recipient_name} ({self.get_status_display()})"
