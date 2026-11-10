from rest_framework import serializers
from apps.catalog.models import Category, Plants, PlantsDetail, Media


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "is_active", "sort_order", "created_at", "updated_at"]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "plant_detail", "file_url", "media_type", "is_primary", "display_order", "created_at"]
        read_only_fields = ["id", "created_at"]


class PlantsDetailSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = PlantsDetail
        fields = [
            "id",
            "plant",
            "sku",
            "size",
            "height",
            "sale_price",
            "rental_price",
            "stock_quantity",
            "status",
            "description",
            "media",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PlantsSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    details = PlantsDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Plants
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "slug",
            "description",
            "care_guide",
            "is_active",
            "details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]
