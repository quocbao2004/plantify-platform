import uuid
from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.inventory.constants.choices import StockMovementType


class StockMovement(UUIDTimeStampedModel):
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="movements",
        verbose_name="Biến thể cây",
    )
    movement_type = models.CharField(
        max_length=30,
        choices=StockMovementType.choices,
        verbose_name="Loại biến động",
    )
    quantity_delta = models.IntegerField(verbose_name="Số lượng thay đổi (+ hoặc -)")
    reference_type = models.CharField(max_length=50, blank=True, verbose_name="Loại chứng từ tham chiếu")
    reference_id = models.UUIDField(null=True, blank=True, verbose_name="ID chứng từ")
    note = models.CharField(max_length=255, blank=True, verbose_name="Ghi chú")
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="performed_stock_movements",
        verbose_name="Người thực hiện",
    )

    class Meta:
        db_table = "inventory_stock_movements"
        verbose_name = "Nhật ký biến động kho bán"
        verbose_name_plural = "Nhật ký biến động kho bán"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.variant.sku} {self.quantity_delta:+d} ({self.get_movement_type_display()})"
