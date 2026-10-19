from rest_framework import serializers
from apps.cms.models.post import Post


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_name",
            "title",
            "slug",
            "body",
            "type",
            "type_display",
            "status",
            "published_at",
            "created_at",
        ]
        read_only_fields = ["id", "author", "slug", "created_at"]
