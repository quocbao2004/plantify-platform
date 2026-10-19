from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.system_settings.constants.choices import AuditAction


class AuditLog(UUIDTimeStampedModel):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        verbose_name="Người thực hiện",
    )
    action = models.CharField(
        max_length=30,
        choices=AuditAction.choices,
        db_index=True,
        verbose_name="Hành động",
    )
    entity_type = models.CharField(max_length=100, db_index=True, verbose_name="Loại thực thể")
    entity_id = models.UUIDField(db_index=True, verbose_name="ID thực thể")
    metadata = models.JSONField(default=dict, blank=True, verbose_name="Dữ liệu chi tiết thay đổi")
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "system_audit_logs"
        verbose_name = "Nhật ký kiểm toán hệ thống"
        verbose_name_plural = "Nhật ký kiểm toán hệ thống"
        ordering = ["-occurred_at"]

    def __str__(self):
        actor_email = self.actor.email if self.actor else "System"
        return f"[{self.get_action_display()}] {self.entity_type} #{self.entity_id} by {actor_email}"
