from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .plants_detail import PlantsDetail


class Media(UUIDTimeStampedModel):
    """
    Media model for plant detail photos and videos.
    """
    class MediaType(models.TextChoices):
        IMAGE = "IMAGE", "Hình ảnh"
        VIDEO = "VIDEO", "Video"

    plant_detail = models.ForeignKey(
        PlantsDetail,
        on_delete=models.CASCADE,
        related_name="media",
        verbose_name="Chi tiết cây",
    )
    file_url = models.URLField(max_length=500, verbose_name="Đường dẫn file / media")
    media_type = models.CharField(
        max_length=20,
        choices=MediaType.choices,
        default=MediaType.IMAGE,
        verbose_name="Loại media",
    )
    is_primary = models.BooleanField(default=False, verbose_name="Ảnh / Video chính")
    display_order = models.PositiveIntegerField(default=0, verbose_name="Thứ tự hiển thị")

    class Meta:
        db_table = "media"
        verbose_name = "Media cây"
        verbose_name_plural = "Media cây"
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return f"Media for {self.plant_detail.sku} ({self.media_type})"
