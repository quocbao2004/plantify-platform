from django.db import models


class PaymentMethod(models.TextChoices):
    COD = "COD", "Thanh toán khi nhận hàng"
    BANK_TRANSFER = "BANK_TRANSFER", "Chuyển khoản ngân hàng"
    VNPAY = "VNPAY", "Cổng thanh toán VNPAY"
    MOMO = "MOMO", "Ví điện tử MoMo"
    ZALOPAY = "ZALOPAY", "Ví ZaloPay"


class PaymentPurpose(models.TextChoices):
    CHECKOUT = "CHECKOUT", "Thanh toán đơn hàng"
    RENT_EXTENSION = "RENT_EXTENSION", "Gia hạn hợp đồng thuê"
    DAMAGE_FEE = "DAMAGE_FEE", "Bồi thường hư hỏng cây"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING", "Chờ thanh toán"
    PAID = "PAID", "Đã thanh toán thành công"
    FAILED = "FAILED", "Thanh toán thất bại"
    EXPIRED = "EXPIRED", "Hết hạn thanh toán"


class AllocationComponent(models.TextChoices):
    SALE = "SALE", "Tiền mua sản phẩm"
    RENT_FEE = "RENT_FEE", "Tiền thuê cây cảnh"
    DEPOSIT = "DEPOSIT", "Tiền cọc giữ cây (Ký quỹ)"
    SHIPPING = "SHIPPING", "Phí giao hàng"
    EXTENSION = "EXTENSION", "Phí thuê bổ sung"
    DAMAGE = "DAMAGE", "Phí hư hại khấu trừ cọc"


class RefundStatus(models.TextChoices):
    PENDING = "PENDING", "Đang xử lý hoàn tiền"
    SUCCESS = "SUCCESS", "Đã hoàn tiền thành công"
    FAILED = "FAILED", "Hoàn tiền thất bại"


class DepositEntryType(models.TextChoices):
    HELD = "HELD", "Tạm giữ cọc"
    REFUNDED = "REFUNDED", "Đã hoàn trả khách"
    WITHHELD = "WITHHELD", "Khấu trừ bồi thường"
