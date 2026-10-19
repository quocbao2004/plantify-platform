from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel


class SystemSetting(UUIDTimeStampedModel):
    key = models.CharField(max_length=100, unique=True, db_index=True, verbose_name="Khóa cấu hình")
    value = models.JSONField(default=dict, verbose_name="Giá trị cấu hình")
    description = models.CharField(max_length=255, blank=True, verbose_name="Mô tả cấu hình")
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_system_settings",
        verbose_name="Người cập nhật",
    )

    class Meta:
        db_table = "system_settings"
        verbose_name = "Cấu hình hệ thống"
        verbose_name_plural = "Cấu hình hệ thống"

    def __str__(self):
        return f"{self.key}: {self.value}"
