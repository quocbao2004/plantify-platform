import pytest
from apps.accounts.models import User
from apps.cms.models.post import Post
from apps.cms.constants.choices import PostType, PostStatus


@pytest.mark.django_db
def test_create_cms_post():
    author = User.objects.create_user(email="writer@plantify.vn", password="Password123!", full_name="Writer")
    post = Post.objects.create(
        author=author,
        title="Cách chăm sóc cây Lan Ý trong phòng kín",
        body="Lan ý là loại cây lọc không khí cực tốt...",
        type=PostType.BLOG,
        status=PostStatus.PUBLISHED,
    )
    assert post.slug == "cach-cham-soc-cay-lan-y-trong-phong-kin"
    assert post.status == PostStatus.PUBLISHED
