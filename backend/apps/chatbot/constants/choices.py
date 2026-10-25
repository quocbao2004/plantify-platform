from django.db import models


class ConversationStatus(models.TextChoices):
    BOT = "BOT", "Trợ lý ảo tự động trả lời"
    WAITING_AGENT = "WAITING_AGENT", "Chờ nhân viên hỗ trợ tiếp nhận"
    AGENT = "AGENT", "Đang chat với nhân viên hỗ trợ"
    CLOSED = "CLOSED", "Cuộc trò chuyện đã kết thúc"


class MessageSenderType(models.TextChoices):
    CUSTOMER = "CUSTOMER", "Khách hàng"
    BOT = "BOT", "Trợ lý ảo AI"
    STAFF = "STAFF", "Nhân viên tư vấn"
