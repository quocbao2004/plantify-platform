from django.db import models
from apps.common.models.base import UUIDTimeStampedModel


class Banner(UUIDTimeStampedModel):
    title = models.CharField(max_length=200, verbose_name="Tiêu đề banner")
    image = models.ImageField(upload_to="banners/%Y/%m/", verbose_name="Hình ảnh banner")
    link_url = models.URLField(max_length=500, blank=True, verbose_name="Đường dẫn liên kết")
    position = models.CharField(max_length=50, default="HOME_HERO", db_index=True, verbose_name="Vị trí hiển thị")
    sort_order = models.PositiveIntegerField(default=0, db_index=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = "cms_banners"
        verbose_name = "Banner quảng cáo"
        verbose_name_plural = "Banner quảng cáo"
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.position})"
