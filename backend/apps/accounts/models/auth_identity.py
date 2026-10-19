from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.constants.choices import SocialProvider


class SocialIdentity(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_identities",
    )
    provider = models.CharField(max_length=20, choices=SocialProvider.choices, verbose_name="Nhà cung cấp")
    provider_subject = models.CharField(max_length=255, db_index=True, verbose_name="ID từ nhà cung cấp")
    linked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "accounts_social_identities"
        unique_together = ("provider", "provider_subject")
        verbose_name = "Liên kết tài khoản mạng xã hội"
        verbose_name_plural = "Liên kết tài khoản mạng xã hội"

    def __str__(self):
        return f"{self.user.email} - {self.provider}"
