from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.loyalty.models.tier import LoyaltyTier


class LoyaltyAccount(UUIDTimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loyalty_account",
        verbose_name="Khách hàng",
    )
    tier = models.ForeignKey(
        LoyaltyTier,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="accounts",
        verbose_name="Hạng hiện tại",
    )
    points_balance = models.IntegerField(default=0, verbose_name="Số điểm khả dụng")
    qualifying_spend_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tổng chi tiêu tích lũy (VNĐ)")

    class Meta:
        db_table = "loyalty_accounts"
        verbose_name = "Tài khoản khách hàng thân thiết"
        verbose_name_plural = "Tài khoản khách hàng thân thiết"

    def __str__(self):
        tier_name = self.tier.name if self.tier else "Mới"
        return f"{self.user.email} - {tier_name} ({self.points_balance} điểm)"
