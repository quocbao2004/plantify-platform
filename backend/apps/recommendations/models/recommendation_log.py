from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.recommendations.constants.choices import RecommendationStrategy


class RecommendationLog(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="recommendation_logs",
    )
    strategy = models.CharField(
        max_length=30,
        choices=RecommendationStrategy.choices,
        default=RecommendationStrategy.RULE_BASED,
    )
    product_ids = models.JSONField(default=list, help_text="Danh sách ID sản phẩm được đề xuất")
    context = models.JSONField(default=dict, help_text="Ngữ cảnh gợi ý (vị trí hiển thị, bộ lọc áp dụng)")
    generated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "recommendations_logs"
        verbose_name = "Nhật ký gợi ý sản phẩm"
        verbose_name_plural = "Nhật ký gợi ý sản phẩm"
        ordering = ["-generated_at"]
