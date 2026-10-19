from rest_framework import serializers
from apps.rentals.models.contract import RentalContract, RentalContractItem
from apps.inventory.serializers.asset import PlantAssetSerializer


class RentalContractItemReadSerializer(serializers.ModelSerializer):
    plant_asset_info = PlantAssetSerializer(source="plant_asset", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = RentalContractItem
        fields = [
            "id",
            "order_item",
            "plant_asset",
            "plant_asset_info",
            "start_at",
            "end_at",
            "returned_at",
            "rental_fee_vnd",
            "deposit_vnd",
            "status",
            "status_display",
        ]


class RentalContractReadSerializer(serializers.ModelSerializer):
    items = RentalContractItemReadSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = RentalContract
        fields = [
            "id",
            "order",
            "contract_code",
            "status",
            "status_display",
            "deposit_total_vnd",
            "signed_at",
            "completed_at",
            "items",
            "created_at",
        ]
