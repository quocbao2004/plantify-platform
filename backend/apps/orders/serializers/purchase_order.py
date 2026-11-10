from rest_framework import serializers
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.catalog.serializers import PlantsDetailSerializer


class PurchaseOrderDetailSerializer(serializers.ModelSerializer):
    plant_detail_info = PlantsDetailSerializer(source="plant_detail", read_only=True)

    class Meta:
        model = PurchaseOrderDetail
        fields = [
            "id",
            "purchase_order",
            "plant_detail",
            "plant_detail_info",
            "quantity",
            "unit_price",
            "total_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PurchaseOrderSerializer(serializers.ModelSerializer):
    details = PurchaseOrderDetailSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "user",
            "user_email",
            "order_code",
            "total_amount",
            "status",
            "shipping_address",
            "recipient_name",
            "recipient_phone",
            "notes",
            "details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
