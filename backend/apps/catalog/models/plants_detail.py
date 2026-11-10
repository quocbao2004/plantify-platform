from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .plants import Plants


class PlantsDetail(UUIDTimeStampedModel):
    """
    PlantsDetail model representing specific plant variations, sizes, pricing, and inventory.
    """
    class PlantStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Có sẵn"
        RENTED = "RENTED", "Đang cho thuê"
        SOLD = "SOLD", "Đã bán"
        MAINTENANCE = "MAINTENANCE", "Đang bảo dưỡng"

    plant = models.ForeignKey(
        Plants,
        on_delete=models.CASCADE,
        related_name="details",
        verbose_name="Cây",
    )
    sku = models.CharField(max_length=100, unique=True, db_index=True, verbose_name="Mã SKU")
    size = models.CharField(max_length=50, blank=True, verbose_name="Kích thước (S, M, L, XL)")
    height = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Chiều cao (cm)",
    )
    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Giá bán",
    )
    rental_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Giá thuê / tháng",
    )
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name="Số lượng tồn kho")
    status = models.CharField(
        max_length=20,
        choices=PlantStatus.choices,
        default=PlantStatus.AVAILABLE,
        db_index=True,
        verbose_name="Trạng thái",
    )
    description = models.TextField(blank=True, verbose_name="Mô tả chi tiết")

    class Meta:
        db_table = "plants_details"
        verbose_name = "Chi tiết cây"
        verbose_name_plural = "Chi tiết cây"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.plant.name} - SKU: {self.sku} ({self.size})"
