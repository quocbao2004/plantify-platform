from rest_framework import serializers
from apps.reviews.models.review import ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            "id",
            "product",
            "order_item",
            "user",
            "user_name",
            "rating",
            "comment",
            "status",
            "status_display",
            "created_at",
        ]
        read_only_fields = ["id", "user", "status", "created_at"]
