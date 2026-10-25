from django.db import models


class OrderItemType(models.TextChoices):
    SALE = "SALE", "Mua sản phẩm"
    RENT = "RENT", "Thuê cây cảnh"


class OrderStatus(models.TextChoices):
    PENDING_PAYMENT = "PENDING_PAYMENT", "Chờ thanh toán"
    CONFIRMED = "CONFIRMED", "Đã xác nhận thanh toán/đơn hàng"
    PROCESSING = "PROCESSING", "Đang đóng gói / Chuẩn bị cây"
    SHIPPING = "SHIPPING", "Đang giao hàng"
    DELIVERED = "DELIVERED", "Đã giao hàng thành công"
    COMPLETED = "COMPLETED", "Đã hoàn thành toàn diện"
    CANCELLED = "CANCELLED", "Đã hủy đơn"


class CartStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Đang hoạt động"
    ABANDONED = "ABANDONED", "Bỏ rơi"
    ORDERED = "ORDERED", "Đã đặt hàng"


class StockReservationStatus(models.TextChoices):
    PENDING = "PENDING", "Đang giữ chỗ"
    COMMITTED = "COMMITTED", "Đã xuất bán thành công"
    RELEASED = "RELEASED", "Đã giải phóng do hủy/hết hạn"


class ShipmentStatus(models.TextChoices):
    PREPARING = "PREPARING", "Đang chuẩn bị"
    IN_TRANSIT = "IN_TRANSIT", "Đang vận chuyển"
    DELIVERED = "DELIVERED", "Giao thành công"
    FAILED = "FAILED", "Giao thất bại"
