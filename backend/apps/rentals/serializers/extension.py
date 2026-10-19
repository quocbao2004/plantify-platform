from rest_framework import serializers
from apps.rentals.models.extension import RentalExtensionRequest


class RentalExtensionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = RentalExtensionRequest
        fields = [
            "id",
            "contract_item",
            "requested_end_at",
            "reason",
            "status",
            "status_display",
            "additional_fee_vnd",
            "reviewed_at",
            "created_at",
        ]
        read_only_fields = ["id", "status", "additional_fee_vnd", "reviewed_at", "created_at"]
