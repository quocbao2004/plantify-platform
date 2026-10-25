from django.db import transaction
from django.utils import timezone
from apps.accounts.models import User
from apps.cms.models.post import Post
from apps.cms.constants.choices import PostStatus, PostType


@transaction.atomic
def create_and_publish_post(
    author: User,
    *,
    title: str,
    body: str,
    post_type: str = PostType.BLOG,
    publish: bool = True,
) -> Post:
    status = PostStatus.PUBLISHED if publish else PostStatus.DRAFT
    published_at = timezone.now() if publish else None
    post = Post.objects.create(
        author=author,
        title=title,
        body=body,
        type=post_type,
        status=status,
        published_at=published_at,
    )
    return post
