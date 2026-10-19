from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.inventory.constants.choices import PlantAssetCondition
from apps.rentals.models.contract import RentalContractItem


class RentalInspection(UUIDTimeStampedModel):
    contract_item = models.ForeignKey(
        RentalContractItem,
        on_delete=models.CASCADE,
        related_name="inspections",
    )
    inspected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="conducted_inspections",
        verbose_name="Nhân viên kiểm tra",
    )
    condition = models.CharField(
        max_length=30,
        choices=PlantAssetCondition.choices,
        default=PlantAssetCondition.GOOD,
        verbose_name="Tình trạng cây sau thu hồi",
    )
    damage_fee_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Phí bồi thường hư hại (VNĐ)")
    notes = models.TextField(blank=True, verbose_name="Ghi chú thẩm định")
    inspected_at = models.DateTimeField(default=timezone.now, verbose_name="Thời điểm kiểm tra")

    class Meta:
        db_table = "rental_inspections"
        verbose_name = "Biên bản kiểm tra cây thu hồi"
        verbose_name_plural = "Biên bản kiểm tra cây thu hồi"
        ordering = ["-inspected_at"]
