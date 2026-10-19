from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.product import Product
from apps.recommendations.constants.choices import ActivityEventType


class UserActivityEvent(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="activity_events",
        verbose_name="Người dùng",
    )
    anonymous_session_id = models.UUIDField(null=True, blank=True, db_index=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="activity_events",
        verbose_name="Sản phẩm tương tác",
    )
    event_type = models.CharField(
        max_length=20,
        choices=ActivityEventType.choices,
        db_index=True,
        verbose_name="Loại hành vi",
    )
    search_query = models.CharField(max_length=255, blank=True, verbose_name="Từ khóa tìm kiếm")
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "recommendations_activity_events"
        verbose_name = "Nhật ký hành vi người dùng"
        verbose_name_plural = "Nhật ký hành vi người dùng"
        ordering = ["-occurred_at"]
        indexes = [
            models.Index(fields=["user", "occurred_at"]),
            models.Index(fields=["product", "event_type"]),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else f"Anon #{self.anonymous_session_id}"
        return f"{user_str} - {self.get_event_type_display()}"
