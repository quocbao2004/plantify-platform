from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.notifications.constants.choices import NotificationType


class Notification(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Người nhận",
    )
    type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
        db_index=True,
    )
    title = models.CharField(max_length=200, verbose_name="Tiêu đề thông báo")
    body = models.TextField(verbose_name="Nội dung thông báo")
    payload = models.JSONField(default=dict, blank=True, help_text="Metadata điều hướng UI (link, target_id)")
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications_notifications"
        verbose_name = "Thông báo"
        verbose_name_plural = "Thông báo"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read", "created_at"]),
        ]

    def __str__(self):
        return f"[{self.get_type_display()}] {self.title} - {self.user.email}"
