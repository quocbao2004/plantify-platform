from django.db import models


class AuditAction(models.TextChoices):
    CREATE = "CREATE", "Tạo mới"
    UPDATE = "UPDATE", "Cập nhật"
    DELETE = "DELETE", "Xóa"
    APPROVE = "APPROVE", "Phê duyệt"
    REJECT = "REJECT", "Từ chối"
