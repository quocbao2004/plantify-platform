from rest_framework import serializers
from apps.orders.models.cart import Cart, CartItem
from apps.catalog.serializers.variant import ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    variant_info = ProductVariantSerializer(source="variant", read_only=True)
    variant_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "variant",
            "variant_id",
            "variant_info",
            "item_type",
            "quantity",
            "rental_start_at",
            "rental_end_at",
            "created_at",
        ]
        read_only_fields = ["id", "variant", "created_at"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "status", "items", "updated_at"]
