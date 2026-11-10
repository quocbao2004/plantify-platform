from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .rental_order import RentalOrder
from apps.catalog.models import PlantsDetail


class RentalOrderDetail(UUIDTimeStampedModel):
    """
    RentalOrderDetail model representing individual plants in a rental order.
    """
    rental_order = models.ForeignKey(
        RentalOrder,
        on_delete=models.CASCADE,
        related_name="details",
        verbose_name="Đơn thuê",
    )
    plant_detail = models.ForeignKey(
        PlantsDetail,
        on_delete=models.PROTECT,
        related_name="rental_order_details",
        verbose_name="Chi tiết cây",
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name="Số lượng")
    rental_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name="Giá thuê theo tháng",
    )
    rental_duration_days = models.PositiveIntegerField(
        default=30,
        verbose_name="Thời gian thuê (ngày)",
    )
    total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        verbose_name="Thành tiền",
    )

    class Meta:
        db_table = "rental_order_details"
        verbose_name = "Chi tiết đơn thuê"
        verbose_name_plural = "Chi tiết đơn thuê"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.rental_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rental_order.order_code} - {self.plant_detail.sku} (x{self.quantity})"
