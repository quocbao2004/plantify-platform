from django.db import models


class RentalContractStatus(models.TextChoices):
    PENDING_DELIVERY = "PENDING_DELIVERY", "Chờ giao cây"
    ACTIVE = "ACTIVE", "Đang hiệu lực thuê"
    EXTENDED = "EXTENDED", "Đã được gia hạn"
    RETURNING = "RETURNING", "Đang thu hồi cây"
    COMPLETED = "COMPLETED", "Đã hoàn thành & Quyết toán cọc"
    CANCELLED = "CANCELLED", "Đã hủy hợp đồng"


class RentalItemStatus(models.TextChoices):
    PENDING_ALLOCATION = "PENDING_ALLOCATION", "Chờ gán cây vật lý"
    ALLOCATED = "ALLOCATED", "Đã gán cây vật lý"
    DELIVERED = "DELIVERED", "Đã giao cho khách"
    RETURNED = "RETURNED", "Đã thu hồi về vườn"
    LOST_OR_DAMAGED = "LOST_OR_DAMAGED", "Thất lạc hoặc chết cây"


class RentalBookingStatus(models.TextChoices):
    RESERVED = "RESERVED", "Giữ chỗ lịch thuê"
    ACTIVE = "ACTIVE", "Đang trong kỳ thuê"
    COMPLETED = "COMPLETED", "Đã kết thúc lịch thuê"
    CANCELED = "CANCELED", "Đã hủy lịch giữ chỗ"


class ExtensionRequestStatus(models.TextChoices):
    PENDING = "PENDING", "Chờ duyệt gia hạn"
    APPROVED = "APPROVED", "Đã duyệt gia hạn"
    REJECTED = "REJECTED", "Từ chối gia hạn"
