from rest_framework import serializers
from apps.orders.models import Shipment


class ShipmentSerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source="order.order_code", read_only=True)
    order_total = serializers.DecimalField(source="order.total_amount", max_digits=14, decimal_places=2, read_only=True)
    shipper_name = serializers.CharField(source="shipper.full_name", read_only=True, default="")
    shipper_phone = serializers.CharField(source="shipper.phone", read_only=True, default="")
    shipper_email = serializers.CharField(source="shipper.email", read_only=True, default="")
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    items_count = serializers.SerializerMethodField()
    plant_names = serializers.SerializerMethodField()

    class Meta:
        model = Shipment
        fields = [
            "id",
            "tracking_code",
            "order",
            "order_code",
            "order_total",
            "shipper",
            "shipper_name",
            "shipper_phone",
            "shipper_email",
            "status",
            "status_display",
            "recipient_name",
            "recipient_phone",
            "shipping_address",
            "cod_amount",
            "cod_collected",
            "proof_image",
            "shipper_notes",
            "admin_notes",
            "items_count",
            "plant_names",
            "assigned_at",
            "delivered_at",
            "confirmed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "tracking_code",
            "created_at",
            "updated_at",
        ]

    def get_items_count(self, obj):
        if hasattr(obj, "order") and obj.order and hasattr(obj.order, "details"):
            return obj.order.details.count()
        return 0

    def get_plant_names(self, obj):
        if hasattr(obj, "order") and obj.order and hasattr(obj.order, "details"):
            names = []
            for d in obj.order.details.all()[:3]:
                if d.plant_detail and d.plant_detail.plant:
                    names.append(d.plant_detail.plant.name)
            return names
        return []
