from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.product import Product


class ProductImage(UUIDTimeStampedModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Sản phẩm",
    )
    image = models.ImageField(upload_to="products/%Y/%m/", verbose_name="Hình ảnh")
    alt_text = models.CharField(max_length=255, blank=True, verbose_name="Văn bản thay thế")
    sort_order = models.PositiveIntegerField(default=0, db_index=True)
    is_primary = models.BooleanField(default=False, db_index=True, verbose_name="Ảnh đại diện")

    class Meta:
        db_table = "catalog_product_images"
        verbose_name = "Hình ảnh sản phẩm"
        verbose_name_plural = "Hình ảnh sản phẩm"
        ordering = ["-is_primary", "sort_order", "created_at"]

    def __str__(self):
        return f"Image of {self.product.name} (Primary: {self.is_primary})"
