from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .purchase_order import PurchaseOrder
from apps.catalog.models import PlantsDetail


class PurchaseOrderDetail(UUIDTimeStampedModel):
    """
    PurchaseOrderDetail model for items in a purchase order.
    """
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="details",
        verbose_name="Đơn mua hàng",
    )
    plant_detail = models.ForeignKey(
        PlantsDetail,
        on_delete=models.PROTECT,
        related_name="purchase_order_details",
        verbose_name="Chi tiết cây",
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Số lượng")
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name="Đơn giá",
    )
    total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        verbose_name="Thành tiền",
    )

    class Meta:
        db_table = "purchase_order_details"
        verbose_name = "Chi tiết đơn mua"
        verbose_name_plural = "Chi tiết đơn mua"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.purchase_order.order_code} - {self.plant_detail.sku} (x{self.quantity})"
