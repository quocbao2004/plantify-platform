from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.constants.choices import PlantSize
from apps.catalog.models.product import Product


class ProductVariant(UUIDTimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
        verbose_name="Sản phẩm gốc",
    )
    sku = models.CharField(max_length=64, unique=True, db_index=True, verbose_name="Mã SKU")
    size = models.CharField(
        max_length=30,
        choices=PlantSize.choices,
        default=PlantSize.MEDIUM,
        db_index=True,
        verbose_name="Kích thước",
    )
    height_cm = models.PositiveIntegerField(default=0, verbose_name="Chiều cao (cm)")

    # Pricing in whole VND
    sale_price_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Giá bán (VNĐ)")
    deposit_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tiền cọc thuê (VNĐ)")

    can_sell = models.BooleanField(default=True, db_index=True, verbose_name="Cho phép bán")
    can_rent = models.BooleanField(default=True, db_index=True, verbose_name="Cho phép thuê")
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="Kích hoạt")

    class Meta:
        db_table = "catalog_product_variants"
        verbose_name = "Biến thể sản phẩm"
        verbose_name_plural = "Biến thể sản phẩm"
        ordering = ["sale_price_vnd"]

    def __str__(self):
        return f"{self.product.name} [{self.sku}] - {self.get_size_display()}"
