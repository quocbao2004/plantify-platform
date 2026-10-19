from django.db import models


class PostType(models.TextChoices):
    BLOG = "BLOG", "Bài viết chia sẻ / Hướng dẫn"
    NEWS = "NEWS", "Tin tức hoạt động"


class PostStatus(models.TextChoices):
    DRAFT = "DRAFT", "Bản nháp"
    PUBLISHED = "PUBLISHED", "Đã xuất bản"
