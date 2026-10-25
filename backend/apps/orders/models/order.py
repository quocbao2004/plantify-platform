from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.constants.choices import OrderStatus


class Order(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders",
    )
    order_code = models.CharField(max_length=64, unique=True, db_index=True, verbose_name="Mã đơn hàng")
    status = models.CharField(
        max_length=30,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING_PAYMENT,
        db_index=True,
    )
    currency = models.CharField(max_length=10, default="VND")

    # Financial breakdown in whole VND
    subtotal_sale_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tiền mua sản phẩm (VNĐ)")
    subtotal_rent_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tiền thuê cây (VNĐ)")
    deposit_total_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tổng tiền cọc thuê (VNĐ)")
    shipping_fee_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Phí vận chuyển (VNĐ)")
    discount_total_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tổng giảm giá / Voucher (VNĐ)")
    payable_total_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tổng tiền thanh toán (VNĐ)")

    shipping_address_snapshot = models.JSONField(default=dict, verbose_name="Snapshot địa chỉ giao hàng")
    placed_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "orders_orders"
        verbose_name = "Đơn hàng"
        verbose_name_plural = "Đơn hàng"
        ordering = ["-placed_at"]

    def __str__(self):
        return f"Order #{self.order_code} - {self.payable_total_vnd:,}₫ ({self.get_status_display()})"
