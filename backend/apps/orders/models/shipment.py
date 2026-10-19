from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.constants.choices import ShipmentStatus
from apps.orders.models.order import Order


class Shipment(UUIDTimeStampedModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="shipments",
    )
    tracking_code = models.CharField(max_length=100, blank=True, db_index=True)
    carrier = models.CharField(max_length=100, blank=True, verbose_name="Đơn vị vận chuyển")
    status = models.CharField(
        max_length=20,
        choices=ShipmentStatus.choices,
        default=ShipmentStatus.PREPARING,
        db_index=True,
    )
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders_shipments"
        verbose_name = "Vận chuyển / Giao hàng"
        verbose_name_plural = "Vận chuyển / Giao hàng"
