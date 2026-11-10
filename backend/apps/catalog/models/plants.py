from django.db import models
from django.utils.text import slugify
from apps.common.models.base import UUIDTimeStampedModel
from .category import Category


class Plants(UUIDTimeStampedModel):
    """
    Plants model representing plant species / products.
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="plants",
        verbose_name="Danh mục",
    )
    name = models.CharField(max_length=255, verbose_name="Tên cây")
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Mô tả")
    care_guide = models.TextField(blank=True, verbose_name="Hướng dẫn chăm sóc")
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="Đang kinh doanh")

    class Meta:
        db_table = "plants"
        verbose_name = "Cây cảnh"
        verbose_name_plural = "Cây cảnh"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
