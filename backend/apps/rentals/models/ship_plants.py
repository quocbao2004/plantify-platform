import uuid
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .rental_contract import RentalContract
from apps.accounts.models import Staff


class ShipPlants(UUIDTimeStampedModel):
    """
    ShipPlants model for shipping and returning plants:
    Supports both direct purchase orders (orders.PurchaseOrder) and rental contracts (rentals.RentalContract).
    """
    class ShipType(models.TextChoices):
        PURCHASE = "PURCHASE", "Giao đơn mua cây"
        DELIVERY = "DELIVERY", "Giao cây thuê ban đầu"
        RETURN = "RETURN", "Thu hồi cây hết hạn"
        REPLACEMENT = "REPLACEMENT", "Giao đổi trả cây"

    class ShipStatus(models.TextChoices):
        PENDING = "PENDING", "Chưa phân công"
        ASSIGNED = "ASSIGNED", "Đã phân công"
        SHIPPING = "SHIPPING", "Đang vận chuyển"
        DELIVERED_PENDING_CONFIRM = "DELIVERED_PENDING_CONFIRM", "Chờ Admin xác nhận (POD)"
        DELIVERED = "DELIVERED", "Giao thành công"
        CANCELLED = "CANCELLED", "Hủy giao"

    ship_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã vận đơn",
    )
    purchase_order = models.ForeignKey(
        "orders.PurchaseOrder",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="ship_tasks",
        verbose_name="Đơn mua cây",
    )
    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
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
    ship_type = models.CharField(
        max_length=20,
        choices=ShipType.choices,
        default=ShipType.DELIVERY,
        verbose_name="Loại vận chuyển",
    )
    status = models.CharField(
        max_length=30,
        choices=ShipStatus.choices,
        default=ShipStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái giao nhận",
    )
    scheduled_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời gian dự kiến giao",
    )
    delivered_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời gian giao thực tế",
    )
    confirmed_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời gian Admin xác nhận hoàn tất",
    )
    delivery_address = models.TextField(
        verbose_name="Địa chỉ giao nhận",
    )
    recipient_name = models.CharField(
        max_length=255,
        verbose_name="Tên người nhận",
    )
    recipient_phone = models.CharField(
        max_length=20,
        verbose_name="Số điện thoại người nhận",
    )
    cod_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Số tiền COD cần thu",
    )
    cod_collected = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Số tiền COD thực tế đã thu",
    )
    proof_image = models.TextField(
        blank=True,
        default="",
        verbose_name="Ảnh bằng chứng giao cây (POD)",
    )
    shipper_notes = models.TextField(
        blank=True,
        default="",
        verbose_name="Ghi chú từ Shipper",
    )
    admin_notes = models.TextField(
        blank=True,
        default="",
        verbose_name="Ghi chú đối soát từ Admin",
    )
    notes = models.TextField(
        blank=True,
        default="",
        verbose_name="Ghi chú giao nhận chung",
    )

    class Meta:
        db_table = "ship_plants"
        verbose_name = "Vận chuyển cây"
        verbose_name_plural = "Vận chuyển cây"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.ship_code:
            self.ship_code = f"SHIP-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        target = self.purchase_order.order_code if self.purchase_order else (self.rental_contract.contract_code if self.rental_contract else "")
        return f"{self.ship_code} - {target} ({self.get_ship_type_display()} - {self.get_status_display()})"
