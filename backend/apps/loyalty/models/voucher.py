from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.loyalty.constants.choices import VoucherDiscountType


class Voucher(UUIDTimeStampedModel):
    code = models.CharField(max_length=64, unique=True, db_index=True, verbose_name="Mã voucher")
    discount_type = models.CharField(
        max_length=20,
        choices=VoucherDiscountType.choices,
        default=VoucherDiscountType.FIXED,
    )
    discount_value = models.PositiveBigIntegerField(verbose_name="Giá trị giảm (VNĐ hoặc %)")
    min_order_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Đơn hàng tối thiểu (VNĐ)")
    max_discount_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Mức giảm tối đa (VNĐ)")
    points_cost = models.PositiveIntegerField(default=0, verbose_name="Số điểm cần để đổi voucher")
    valid_from = models.DateTimeField(verbose_name="Bắt đầu áp dụng")
    valid_to = models.DateTimeField(verbose_name="Hết hạn áp dụng")
    usage_limit = models.PositiveIntegerField(default=100, verbose_name="Giới hạn số lượt dùng")

    class Meta:
        db_table = "loyalty_vouchers"
        verbose_name = "Voucher / Mã giảm giá"
        verbose_name_plural = "Voucher / Mã giảm giá"

    def __str__(self):
        return f"Voucher {self.code} ({self.get_discount_type_display()}: {self.discount_value:,})"
