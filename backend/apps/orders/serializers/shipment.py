from rest_framework import serializers
from apps.orders.models.shipment import Shipment


class ShipmentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Shipment
        fields = [
            "id",
            "order",
            "tracking_code",
            "carrier",
            "status",
            "status_display",
            "shipped_at",
            "delivered_at",
            "created_at",
        ]
