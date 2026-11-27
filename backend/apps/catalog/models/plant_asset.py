import uuid
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .plants_detail import PlantsDetail


class PlantAsset(UUIDTimeStampedModel):
    """
    Model quản lý từng cây cảnh vật lý cụ thể (Physical Individual Plant Asset).
    Mỗi cây có một mã định danh duy nhất (Asset Code / Tag) và mã QR phục vụ
    cho việc theo dõi vị trí, tình trạng sinh trưởng và lịch sử bảo dưỡng khi cho thuê.
    """
    class AssetStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Có sẵn trong kho"
        RENTED = "RENTED", "Đang cho thuê"
        MAINTENANCE = "MAINTENANCE", "Đang bảo dưỡng"
        RESERVED = "RESERVED", "Đã đặt trước"
        RETIRED = "RETIRED", "Đã thanh lý"

    class HealthCondition(models.TextChoices):
        EXCELLENT = "EXCELLENT", "Sinh trưởng tốt"
        FAIR = "FAIR", "Bình thường"
        NEEDS_CARE = "NEEDS_CARE", "Cần chăm sóc"
        DAMAGED = "DAMAGED", "Hư hại / Héo úa"

    plant_detail = models.ForeignKey(
        PlantsDetail,
        on_delete=models.CASCADE,
        related_name="assets",
        verbose_name="Biến thể cây cảnh (SKU)",
    )
    asset_code = models.CharField(
        max_length=60,
        unique=True,
        db_index=True,
        verbose_name="Mã định danh cây cảnh",
    )
    status = models.CharField(
        max_length=20,
        choices=AssetStatus.choices,
        default=AssetStatus.AVAILABLE,
        db_index=True,
        verbose_name="Trạng thái khai thác",
    )
    health_condition = models.CharField(
        max_length=20,
        choices=HealthCondition.choices,
        default=HealthCondition.EXCELLENT,
        verbose_name="Tình trạng sinh trưởng",
    )
    current_location = models.CharField(
        max_length=255,
        default="Kho trung tâm",
        verbose_name="Vị trí hiện tại",
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Ghi chú đặc điểm / Nhật ký cây",
    )
    last_inspected_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Thời điểm kiểm tra gần nhất",
    )

    class Meta:
        db_table = "catalog_plant_assets"
        verbose_name = "Cây cảnh định danh (Asset)"
        verbose_name_plural = "Cây cảnh định danh (Assets)"
        ordering = ["asset_code"]

    def __str__(self):
        plant_name = self.plant_detail.plant.name if self.plant_detail and self.plant_detail.plant else "Cây"
        return f"{self.asset_code} - {plant_name} ({self.get_status_display()})"
