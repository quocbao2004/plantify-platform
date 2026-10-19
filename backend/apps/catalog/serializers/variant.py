from rest_framework import serializers
from apps.catalog.models.variant import ProductVariant
from apps.catalog.models.rental_rate import RentalRate


class RentalRateSerializer(serializers.ModelSerializer):
    unit_display = serializers.CharField(source="get_billing_unit_display", read_only=True)

    class Meta:
        model = RentalRate
        fields = ["id", "billing_unit", "unit_display", "price_vnd", "is_active"]


class ProductVariantSerializer(serializers.ModelSerializer):
    rental_rates = RentalRateSerializer(many=True, read_only=True)
    size_display = serializers.CharField(source="get_size_display", read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "sku",
            "size",
            "size_display",
            "height_cm",
            "sale_price_vnd",
            "deposit_vnd",
            "can_sell",
            "can_rent",
            "is_active",
            "rental_rates",
        ]
