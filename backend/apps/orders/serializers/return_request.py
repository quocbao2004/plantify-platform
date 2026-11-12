from rest_framework import serializers
from apps.orders.models import ReturnRequest


class ReturnRequestSerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source="order.order_code", read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True, default="")
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_phone = serializers.CharField(source="user.phone", read_only=True, default="")
    
    plant_name = serializers.SerializerMethodField()
    plant_sku = serializers.SerializerMethodField()
    plant_size = serializers.SerializerMethodField()
    plant_image = serializers.SerializerMethodField()

    request_type_display = serializers.CharField(source="get_request_type_display", read_only=True)
    reason_display = serializers.CharField(source="get_reason_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ReturnRequest
        fields = [
            "id",
            "return_code",
            "order",
            "order_code",
            "order_detail",
            "plant_name",
            "plant_sku",
            "plant_size",
            "plant_image",
            "user",
            "user_name",
            "user_email",
            "user_phone",
            "request_type",
            "request_type_display",
            "reason",
            "reason_display",
            "status",
            "status_display",
            "quantity",
            "refund_amount",
            "customer_notes",
            "proof_images",
            "admin_notes",
            "resolution_action",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "return_code",
            "created_at",
            "updated_at",
        ]

    def get_plant_name(self, obj):
        if obj.order_detail and obj.order_detail.plant_detail:
            plant = getattr(obj.order_detail.plant_detail, "plant", None)
            return plant.name if plant else ""
        return ""

    def get_plant_sku(self, obj):
        if obj.order_detail and obj.order_detail.plant_detail:
            return obj.order_detail.plant_detail.sku or ""
        return ""

    def get_plant_size(self, obj):
        if obj.order_detail and obj.order_detail.plant_detail:
            return obj.order_detail.plant_detail.size or ""
        return ""

    def get_plant_image(self, obj):
        try:
            if obj.order_detail and obj.order_detail.plant_detail:
                pd = obj.order_detail.plant_detail
                media = pd.media.filter(is_primary=True).first() or pd.media.first()
                return media.file_url if media else None
        except Exception:
            pass
        return None
