from django.db import models


class LoyaltyTierCode(models.TextChoices):
    NEW = "NEW", "Thành viên Mới"
    SILVER = "SILVER", "Hạng Bạc"
    GOLD = "GOLD", "Hạng Vàng"
    PLATINUM = "PLATINUM", "Hạng Bạch Kim"


class PointTransactionType(models.TextChoices):
    EARN = "EARN", "Tích điểm từ đơn hàng"
    REDEEM = "REDEEM", "Tiêu điểm đổi voucher/giảm giá"
    REVERSE = "REVERSE", "Đảo điểm do hủy/hoàn đơn"
    ADJUST = "ADJUST", "Điều chỉnh thủ công từ hệ thống"


class VoucherDiscountType(models.TextChoices):
    FIXED = "FIXED", "Giảm số tiền cố định (VNĐ)"
    PERCENT = "PERCENT", "Giảm theo phần trăm (%)"


class UserVoucherStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Chưa sử dụng"
    USED = "USED", "Đã sử dụng"
    EXPIRED = "EXPIRED", "Đã hết hạn"
