from django.db import models


class ReviewStatus(models.TextChoices):
    PENDING = "PENDING", "Chờ kiểm duyệt"
    PUBLISHED = "PUBLISHED", "Đã xuất bản hiển thị"
    HIDDEN = "HIDDEN", "Đã ẩn do vi phạm tiêu chuẩn"
