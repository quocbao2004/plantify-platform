from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .rental_contract import RentalContract
from apps.accounts.models import Staff


class ShipPlants(UUIDTimeStampedModel):
    """
    ShipPlants model for shipping and returning rented plants under a contract.
    """
    class ShipType(models.TextChoices):
        DELIVERY = "DELIVERY", "Giao cây ban đầu"
        RETURN = "RETURN", "Thu hồi cây hết hạn"
        REPLACEMENT = "REPLACEMENT", "Giao đổi trả cây"

    class ShipStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ giao"
        SHIPPING = "SHIPPING", "Đang vận chuyển"
        DELIVERED = "DELIVERED", "Giao thành công"
        CANCELLED = "CANCELLED", "Hủy giao"

    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.CASCADE,
        related_name="ship_tasks",
        verbose_name="Hợp đồng thuê",
    )
    staff = models.ForeignKey(
        Staff,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ship_tasks",
        verbose_name="Nhân viên vận chuyển",
    )
    ship_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã vận đơn",
    )
    ship_type = models.CharField(
        max_length=20,
        choices=ShipType.choices,
        default=ShipType.DELIVERY,
        verbose_name="Loại vận chuyển",
    )
    scheduled_date = models.DateTimeField(verbose_name="Thời gian dự kiến giao")
    delivered_date = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian giao thực tế")
    status = models.CharField(
        max_length=20,
        choices=ShipStatus.choices,
        default=ShipStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái giao nhận",
    )
    delivery_address = models.TextField(verbose_name="Địa chỉ giao nhận")
    recipient_name = models.CharField(max_length=255, verbose_name="Tên người nhận")
    recipient_phone = models.CharField(max_length=20, verbose_name="Số điện thoại người nhận")
    notes = models.TextField(blank=True, verbose_name="Ghi chú giao nhận")

    class Meta:
        db_table = "ship_plants"
        verbose_name = "Vận chuyển cây"
        verbose_name_plural = "Vận chuyển cây"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.ship_code} ({self.get_ship_type_display()} - {self.get_status_display()})"
