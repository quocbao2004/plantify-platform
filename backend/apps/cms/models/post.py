from django.conf import settings
from django.db import models
from django.utils.text import slugify
from apps.common.models.base import UUIDTimeStampedModel
from apps.cms.constants.choices import PostType, PostStatus


class Post(UUIDTimeStampedModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="authored_posts",
        verbose_name="Tác giả",
    )
    title = models.CharField(max_length=255, verbose_name="Tiêu đề bài viết")
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    body = models.TextField(verbose_name="Nội dung bài viết")
    type = models.CharField(
        max_length=20,
        choices=PostType.choices,
        default=PostType.BLOG,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=PostStatus.choices,
        default=PostStatus.DRAFT,
        db_index=True,
    )
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        db_table = "cms_posts"
        verbose_name = "Bài viết / Tin tức"
        verbose_name_plural = "Bài viết / Tin tức"
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_type_display()}] {self.title}"
