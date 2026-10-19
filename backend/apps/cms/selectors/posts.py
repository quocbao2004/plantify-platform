from typing import Optional
from django.db.models import QuerySet
from apps.cms.models.post import Post
from apps.cms.constants.choices import PostStatus


def get_published_posts(post_type: str = None) -> QuerySet[Post]:
    qs = Post.objects.filter(status=PostStatus.PUBLISHED).select_related("author").order_by("-published_at")
    if post_type:
        qs = qs.filter(type=post_type)
    return qs


def get_post_by_slug(slug: str) -> Optional[Post]:
    return Post.objects.filter(slug=slug, status=PostStatus.PUBLISHED).select_related("author").first()
