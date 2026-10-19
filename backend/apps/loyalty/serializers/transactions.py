from rest_framework import serializers
from apps.loyalty.models.point_transaction import PointTransaction


class PointTransactionSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = PointTransaction
        fields = [
            "id",
            "type",
            "type_display",
            "points_delta",
            "description",
            "order",
            "created_at",
        ]
