from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.constants.choices import CareExperienceLevel


class UserPreference(UUIDTimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="preference",
    )
    budget_min_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Ngân sách tối thiểu (VNĐ)")
    budget_max_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Ngân sách tối đa (VNĐ)")
    preferred_light = models.CharField(max_length=50, blank=True, verbose_name="Ánh sáng ưa thích")
    preferred_size = models.CharField(max_length=50, blank=True, verbose_name="Kích thước cây ưa thích")
    care_experience = models.CharField(
        max_length=20,
        choices=CareExperienceLevel.choices,
        default=CareExperienceLevel.BEGINNER,
        verbose_name="Kinh nghiệm chăm sóc",
    )

    class Meta:
        db_table = "accounts_preferences"
        verbose_name = "Tùy chọn sở thích người dùng"
        verbose_name_plural = "Tùy chọn sở thích người dùng"

    def __str__(self):
        return f"Preferences of {self.user.email}"
