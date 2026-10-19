from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.models.order import Order
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.constants.choices import PointTransactionType


class PointTransaction(UUIDTimeStampedModel):
    account = models.ForeignKey(
        LoyaltyAccount,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="point_transactions",
    )
    type = models.CharField(
        max_length=20,
        choices=PointTransactionType.choices,
        db_index=True,
    )
    points_delta = models.IntegerField(verbose_name="Biến động điểm (+ hoặc -)")
    description = models.CharField(max_length=255)
    idempotency_key = models.CharField(max_length=128, unique=True, db_index=True)

    class Meta:
        db_table = "loyalty_point_transactions"
        verbose_name = "Nhật ký điểm thưởng"
        verbose_name_plural = "Nhật ký điểm thưởng"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.account.user.email} {self.points_delta:+d} điểm ({self.get_type_display()})"
