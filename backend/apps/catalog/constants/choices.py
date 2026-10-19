from django.db import models


class LightRequirement(models.TextChoices):
    LOW_LIGHT = "LOW_LIGHT", "Ánh sáng yếu / Trong nhà"
    MEDIUM_LIGHT = "MEDIUM_LIGHT", "Bán râm / Ánh sáng gián tiếp"
    BRIGHT_DIRECT = "BRIGHT_DIRECT", "Nắng trực tiếp"


class CareLevel(models.TextChoices):
    EASY = "EASY", "Dễ chăm sóc"
    MODERATE = "MODERATE", "Trung bình"
    DIFFICULT = "DIFFICULT", "Đòi hỏi kỹ thuật cao"


class PlantSize(models.TextChoices):
    SMALL = "SMALL", "Nhỏ (< 30cm)"
    MEDIUM = "MEDIUM", "Trung bình (30 - 80cm)"
    LARGE = "LARGE", "Lớn (> 80cm)"
    EXTRA_LARGE = "EXTRA_LARGE", "Rất lớn (> 150cm)"


class BillingUnit(models.TextChoices):
    DAY = "DAY", "Ngày"
    WEEK = "WEEK", "Tuần"
    MONTH = "MONTH", "Tháng"
