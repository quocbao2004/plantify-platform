from django.db import models


class NotificationType(models.TextChoices):
    ORDER = "ORDER", "Cập nhật đơn hàng"
    RENTAL = "RENTAL", "Nhắc lịch thuê / Thu hồi cây"
    LOYALTY = "LOYALTY", "Tích điểm / Thăng hạng"
    SYSTEM = "SYSTEM", "Thông báo từ ban quản trị"
