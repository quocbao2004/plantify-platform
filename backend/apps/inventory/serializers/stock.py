from rest_framework import serializers
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.models.stock_movement import StockMovement


class StockBalanceSerializer(serializers.ModelSerializer):
    variant_sku = serializers.CharField(source="variant.sku", read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    available_for_sale = serializers.IntegerField(read_only=True)

    class Meta:
        model = StockBalance
        fields = [
            "id",
            "variant",
            "variant_sku",
            "product_name",
            "quantity_on_hand",
            "quantity_reserved",
            "available_for_sale",
            "updated_at",
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    variant_sku = serializers.CharField(source="variant.sku", read_only=True)
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            "id",
            "variant",
            "variant_sku",
            "movement_type",
            "quantity_delta",
            "reference_type",
            "reference_id",
            "note",
            "performed_by_email",
            "created_at",
        ]
