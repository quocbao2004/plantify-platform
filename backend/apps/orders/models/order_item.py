from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.orders.constants.choices import OrderItemType
from apps.orders.models.order import Order


class OrderItem(UUIDTimeStampedModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    item_type = models.CharField(
        max_length=10,
        choices=OrderItemType.choices,
        default=OrderItemType.SALE,
        db_index=True,
    )
    quantity = models.PositiveIntegerField(default=1)

    # Immutable Snapshots
    product_name_snapshot = models.CharField(max_length=255)
    sku_snapshot = models.CharField(max_length=64)
    unit_price_vnd = models.PositiveBigIntegerField(default=0)
    line_total_vnd = models.PositiveBigIntegerField(default=0)
    deposit_total_vnd = models.PositiveBigIntegerField(default=0)

    # Rental period snapshot (null for SALE items)
    rental_start_at = models.DateTimeField(null=True, blank=True)
    rental_end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders_order_items"
        verbose_name = "Chi tiết mục đơn hàng"
        verbose_name_plural = "Chi tiết mục đơn hàng"

    def __str__(self):
        return f"{self.product_name_snapshot} [{self.sku_snapshot}] x{self.quantity}"
