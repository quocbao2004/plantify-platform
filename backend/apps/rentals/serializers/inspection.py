from rest_framework import serializers
from apps.rentals.models.inspection import RentalInspection


class RentalInspectionSerializer(serializers.ModelSerializer):
    inspected_by_name = serializers.CharField(source="inspected_by.full_name", read_only=True)
    condition_display = serializers.CharField(source="get_condition_display", read_only=True)

    class Meta:
        model = RentalInspection
        fields = [
            "id",
            "contract_item",
            "inspected_by",
            "inspected_by_name",
            "condition",
            "condition_display",
            "damage_fee_vnd",
            "notes",
            "inspected_at",
            "created_at",
        ]
        read_only_fields = ["id", "inspected_by", "inspected_at", "created_at"]
