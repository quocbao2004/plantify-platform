from rest_framework import serializers
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.catalog.serializers import PlantsDetailSerializer


class PurchaseOrderDetailSerializer(serializers.ModelSerializer):
    plant_detail_info = PlantsDetailSerializer(source="plant_detail", read_only=True)
    plant_name = serializers.CharField(source="plant_detail.plant.name", read_only=True, default="")
    plant_sku = serializers.CharField(source="plant_detail.sku", read_only=True, default="")
    plant_size = serializers.CharField(source="plant_detail.size", read_only=True, default="")
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderDetail
        fields = [
            "id",
            "purchase_order",
            "plant_detail",
            "plant_name",
            "plant_sku",
            "plant_size",
            "primary_image",
            "plant_detail_info",
            "quantity",
            "unit_price",
            "total_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_primary_image(self, obj):
        try:
            if hasattr(obj, "plant_detail") and obj.plant_detail:
                media = (
                    obj.plant_detail.media.filter(is_primary=True).first()
                    or obj.plant_detail.media.first()
                )
                return media.file_url if media else None
        except Exception:
            pass
        return None


class PurchaseOrderSerializer(serializers.ModelSerializer):
    details = PurchaseOrderDetailSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True, default="")
    user_phone = serializers.CharField(source="user.phone", read_only=True, default="")
    items_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "user_phone",
            "order_code",
            "total_amount",
            "status",
            "status_display",
            "shipping_address",
            "recipient_name",
            "recipient_phone",
            "notes",
            "items_count",
            "details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "order_code", "created_at", "updated_at"]

    def get_items_count(self, obj):
        if hasattr(obj, "details"):
            return obj.details.count()
        return 0
