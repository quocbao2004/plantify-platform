from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.models.order import Order
from apps.loyalty.models.voucher import Voucher
from apps.loyalty.constants.choices import UserVoucherStatus


class UserVoucher(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vouchers",
    )
    voucher = models.ForeignKey(
        Voucher,
        on_delete=models.CASCADE,
        related_name="user_vouchers",
    )
    status = models.CharField(
        max_length=20,
        choices=UserVoucherStatus.choices,
        default=UserVoucherStatus.ACTIVE,
        db_index=True,
    )
    redeemed_at = models.DateTimeField(null=True, blank=True)
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="applied_vouchers",
    )

    class Meta:
        db_table = "loyalty_user_vouchers"
        verbose_name = "Voucher của người dùng"
        verbose_name_plural = "Voucher của người dùng"

    def __str__(self):
        return f"{self.user.email} - {self.voucher.code} ({self.get_status_display()})"
