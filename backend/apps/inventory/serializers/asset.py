from rest_framework import serializers
from apps.inventory.models.plant_asset import PlantAsset


class PlantAssetSerializer(serializers.ModelSerializer):
    variant_sku = serializers.CharField(source="variant.sku", read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    condition_display = serializers.CharField(source="get_condition_display", read_only=True)

    class Meta:
        model = PlantAsset
        fields = [
            "id",
            "variant",
            "variant_sku",
            "product_name",
            "asset_code",
            "condition",
            "condition_display",
            "status",
            "status_display",
            "acquired_at",
            "last_inspected_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
