from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.cms.models.post import Post
from apps.cms.serializers.post import PostSerializer
from apps.cms.selectors.posts import get_published_posts, get_post_by_slug
from apps.common.permissions.is_staff import IsStaffUser


class PostListView(generics.ListCreateAPIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsStaffUser()]
        return [AllowAny()]

    serializer_class = PostSerializer

    def get_queryset(self):
        post_type = self.request.query_params.get("type")
        return get_published_posts(post_type=post_type)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = PostSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return get_published_posts()
