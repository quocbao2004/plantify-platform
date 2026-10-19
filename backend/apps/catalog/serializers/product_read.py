from rest_framework import serializers
from apps.catalog.models.product import Product
from apps.catalog.models.image import ProductImage
from apps.catalog.serializers.category import CategorySerializer
from apps.catalog.serializers.variant import ProductVariantSerializer


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "sort_order", "is_primary"]


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    min_sale_price_vnd = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "category_name",
            "light_requirement",
            "care_level",
            "primary_image",
            "min_sale_price_vnd",
            "is_active",
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return img.image.url if img and img.image else None

    def get_min_sale_price_vnd(self, obj):
        variants = obj.variants.filter(is_active=True, can_sell=True)
        if variants.exists():
            return min(v.sale_price_vnd for v in variants)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "description",
            "care_instructions",
            "light_requirement",
            "care_level",
            "images",
            "variants",
            "is_active",
            "created_at",
            "updated_at",
        ]
