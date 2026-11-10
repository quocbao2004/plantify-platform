from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.models import User


class RentalOrder(UUIDTimeStampedModel):
    """
    RentalOrder model representing customer plant rental requests.
    """
    class RentalStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ xác nhận"
        APPROVED = "APPROVED", "Đã duyệt đơn"
        CONTRACT_SIGNED = "CONTRACT_SIGNED", "Đã ký hợp đồng"
        ACTIVE = "ACTIVE", "Đang trong kỳ thuê"
        COMPLETED = "COMPLETED", "Đã hoàn thành"
        CANCELLED = "CANCELLED", "Đã hủy"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="rental_orders",
        verbose_name="Khách hàng",
    )
    order_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã đơn thuê",
    )
    start_date = models.DateField(verbose_name="Ngày bắt đầu thuê")
    end_date = models.DateField(verbose_name="Ngày kết thúc thuê")
    total_rental_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Tổng tiền thuê cây",
    )
    deposit_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Tiền đặt cọc",
    )
    status = models.CharField(
        max_length=20,
        choices=RentalStatus.choices,
        default=RentalStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái",
    )
    delivery_address = models.TextField(verbose_name="Địa chỉ giao cây")
    recipient_name = models.CharField(max_length=255, verbose_name="Tên người nhận")
    recipient_phone = models.CharField(max_length=20, verbose_name="Số điện thoại")
    notes = models.TextField(blank=True, verbose_name="Ghi chú đơn thuê")

    class Meta:
        db_table = "rental_orders"
        verbose_name = "Đơn thuê cây"
        verbose_name_plural = "Đơn thuê cây"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_code} - {self.recipient_name} ({self.get_status_display()})"
