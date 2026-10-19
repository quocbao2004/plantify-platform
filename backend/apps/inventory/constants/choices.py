from django.db import models


class StockMovementType(models.TextChoices):
    IMPORT = "IMPORT", "Nhập kho"
    SALE_COMMIT = "SALE_COMMIT", "Xuất kho bán"
    DAMAGE_DISCARD = "DAMAGE_DISCARD", "Hủy bỏ do hư hỏng"
    ADJUSTMENT = "ADJUSTMENT", "Kiểm kê điều chỉnh"


class PlantAssetCondition(models.TextChoices):
    GOOD = "GOOD", "Tốt / Đạt chuẩn"
    MINOR_DAMAGE = "MINOR_DAMAGE", "Tổn hại nhẹ (héo lá / cần dưỡng)"
    UNUSABLE = "UNUSABLE", "Hư hỏng nặng / Không thể dùng"


class PlantAssetStatus(models.TextChoices):
    AVAILABLE = "AVAILABLE", "Sẵn sàng cho thuê"
    RESERVED = "RESERVED", "Đã giữ chỗ cho hợp đồng"
    RENTED = "RENTED", "Đang được khách thuê"
    MAINTENANCE = "MAINTENANCE", "Đang dưỡng / Bảo dưỡng"
    RETIRED = "RETIRED", "Ngừng khai thác"
