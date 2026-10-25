from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.orders.constants.choices import StockReservationStatus
from apps.orders.models.order_item import OrderItem


class StockReservation(UUIDTimeStampedModel):
    order_item = models.OneToOneField(
        OrderItem,
        on_delete=models.CASCADE,
        related_name="reservation",
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=StockReservationStatus.choices,
        default=StockReservationStatus.PENDING,
        db_index=True,
    )
    expires_at = models.DateTimeField(db_index=True)

    class Meta:
        db_table = "orders_stock_reservations"
        verbose_name = "Giữ chỗ tồn kho bán"
        verbose_name_plural = "Giữ chỗ tồn kho bán"
