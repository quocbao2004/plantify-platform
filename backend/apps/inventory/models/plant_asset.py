from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.inventory.constants.choices import PlantAssetCondition, PlantAssetStatus


class PlantAsset(UUIDTimeStampedModel):
    """
    Physical individual plant asset managed exclusively for rentals.
    Identified by a unique physical tag/barcode/asset_code.
    """
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="assets",
        verbose_name="Biến thể cây",
    )
    asset_code = models.CharField(max_length=64, unique=True, db_index=True, verbose_name="Mã định danh cây vật lý")
    condition = models.CharField(
        max_length=30,
        choices=PlantAssetCondition.choices,
        default=PlantAssetCondition.GOOD,
        verbose_name="Tình trạng sinh trưởng",
    )
    status = models.CharField(
        max_length=30,
        choices=PlantAssetStatus.choices,
        default=PlantAssetStatus.AVAILABLE,
        db_index=True,
        verbose_name="Trạng thái khai thác",
    )
    acquired_at = models.DateField(default=timezone.now, verbose_name="Ngày nhập vườn")
    last_inspected_at = models.DateTimeField(null=True, blank=True, verbose_name="Lần kiểm tra gần nhất")

    class Meta:
        db_table = "inventory_plant_assets"
        verbose_name = "Cây vật lý cho thuê"
        verbose_name_plural = "Cây vật lý cho thuê"
        ordering = ["asset_code"]

    def __str__(self):
        return f"[{self.asset_code}] {self.variant.product.name} ({self.get_status_display()})"
