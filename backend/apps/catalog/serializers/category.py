from rest_framework import serializers
from apps.catalog.models.category import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "parent",
            "name",
            "slug",
            "description",
            "is_active",
            "sort_order",
        ]
        read_only_fields = ["id", "slug"]
