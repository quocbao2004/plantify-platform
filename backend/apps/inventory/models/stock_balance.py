from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.inventory.utils.availability_math import calculate_available_sale_stock


class StockBalance(UUIDTimeStampedModel):
    variant = models.OneToOneField(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="stock_balance",
        verbose_name="Biến thể cây",
    )
    quantity_on_hand = models.PositiveIntegerField(default=0, verbose_name="Tổng số lượng vật lý trong kho")
    quantity_reserved = models.PositiveIntegerField(default=0, verbose_name="Số lượng đang giữ chỗ chờ thanh toán")

    class Meta:
        db_table = "inventory_stock_balances"
        verbose_name = "Tồn kho sản phẩm bán"
        verbose_name_plural = "Tồn kho sản phẩm bán"

    @property
    def available_for_sale(self) -> int:
        return calculate_available_sale_stock(self.quantity_on_hand, self.quantity_reserved)

    def __str__(self):
        return f"{self.variant.sku} (OnHand: {self.quantity_on_hand}, Reserved: {self.quantity_reserved})"
