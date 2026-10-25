from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.loyalty.constants.choices import LoyaltyTierCode


class LoyaltyTier(UUIDTimeStampedModel):
    code = models.CharField(
        max_length=20,
        choices=LoyaltyTierCode.choices,
        unique=True,
        db_index=True,
        verbose_name="Mã hạng thành viên",
    )
    name = models.CharField(max_length=100, verbose_name="Tên hạng")
    min_qualifying_spend_vnd = models.PositiveBigIntegerField(
        default=0,
        verbose_name="Chi tiêu tích lũy tối thiểu (VNĐ)",
    )
    benefits = models.JSONField(default=dict, blank=True, verbose_name="Đặc quyền thành viên")

    class Meta:
        db_table = "loyalty_tiers"
        verbose_name = "Hạng thành viên"
        verbose_name_plural = "Hạng thành viên"
        ordering = ["min_qualifying_spend_vnd"]

    def __str__(self):
        return f"{self.name} (>= {self.min_qualifying_spend_vnd:,}₫)"
