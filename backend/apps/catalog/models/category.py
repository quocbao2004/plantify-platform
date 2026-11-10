from django.db import models
from django.utils.text import slugify
from apps.common.models.base import UUIDTimeStampedModel


class Category(UUIDTimeStampedModel):
    """
    Category model for plant classification.
    """
    name = models.CharField(max_length=150, unique=True, verbose_name="Tên danh mục")
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Mô tả")
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="Đang kích hoạt")
    sort_order = models.PositiveIntegerField(default=0, db_index=True, verbose_name="Thứ tự hiển thị")

    class Meta:
        db_table = "categories"
        verbose_name = "Danh mục cây"
        verbose_name_plural = "Danh mục cây"
        ordering = ["sort_order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
