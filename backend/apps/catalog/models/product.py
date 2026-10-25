from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.constants.choices import LightRequirement, CareLevel
from apps.catalog.models.category import Category
from apps.catalog.utils.slug import generate_unique_slug


class Product(UUIDTimeStampedModel):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Danh mục",
    )
    name = models.CharField(max_length=255, db_index=True, verbose_name="Tên cây / sản phẩm")
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Mô tả chi tiết")
    care_instructions = models.TextField(blank=True, verbose_name="Hướng dẫn chăm sóc")
    light_requirement = models.CharField(
        max_length=30,
        choices=LightRequirement.choices,
        default=LightRequirement.MEDIUM_LIGHT,
        db_index=True,
        verbose_name="Yêu cầu ánh sáng",
    )
    care_level = models.CharField(
        max_length=30,
        choices=CareLevel.choices,
        default=CareLevel.EASY,
        db_index=True,
        verbose_name="Mức độ chăm sóc",
    )
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="Đang kinh doanh")

    class Meta:
        db_table = "catalog_products"
        verbose_name = "Sản phẩm"
        verbose_name_plural = "Sản phẩm"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Product, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
