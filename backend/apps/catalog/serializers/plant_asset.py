import re
from rest_framework import serializers
from apps.catalog.models import PlantAsset, PlantsDetail


class PlantAssetSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(source="plant_detail.plant.name", read_only=True)
    plant_id = serializers.UUIDField(source="plant_detail.plant.id", read_only=True)
    size = serializers.CharField(source="plant_detail.size", read_only=True)
    sku = serializers.CharField(source="plant_detail.sku", read_only=True)
    care_guide = serializers.CharField(source="plant_detail.plant.care_guide", read_only=True)
    description = serializers.CharField(source="plant_detail.plant.description", read_only=True)
    primary_image = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    health_display = serializers.CharField(source="get_health_condition_display", read_only=True)

    class Meta:
        model = PlantAsset
        fields = [
            "id",
            "plant_detail",
            "plant_id",
            "plant_name",
            "size",
            "sku",
            "asset_code",
            "status",
            "status_display",
            "health_condition",
            "health_display",
            "current_location",
            "notes",
            "primary_image",
            "care_guide",
            "description",
            "last_inspected_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_primary_image(self, obj):
        detail = obj.plant_detail
        if detail:
            for m in detail.media.all():
                if m.is_primary:
                    return m.file_url
            first_media = detail.media.first()
            if first_media:
                return first_media.file_url
        return None


class BatchGenerateAssetsSerializer(serializers.Serializer):
    """
    Serializer tiếp nhận yêu cầu sinh hàng loạt mã số riêng cho cây cảnh.
    """
    plant_detail_id = serializers.UUIDField(required=True)
    quantity = serializers.IntegerField(min_value=1, max_value=500, default=10)
    prefix = serializers.CharField(max_length=20, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, default="Kho trung tâm")

    def validate_plant_detail_id(self, value):
        if not PlantsDetail.objects.filter(id=value).exists():
            raise serializers.ValidationError("Không tìm thấy biến thể cây cảnh (PlantsDetail) tương ứng.")
        return value

    def create(self, validated_data):
        from apps.catalog.utils.plant_code import generate_plant_assets_for_detail

        plant_detail = PlantsDetail.objects.get(id=validated_data["plant_detail_id"])
        quantity = validated_data["quantity"]
        location = validated_data.get("location") or "Kho trung tâm"
        custom_prefix = validated_data.get("prefix", "").strip() or None

        created_assets = generate_plant_assets_for_detail(
            plant_detail=plant_detail,
            quantity=quantity,
            prefix=custom_prefix,
            location=location,
        )

        # Cập nhật lại tồn kho của plant_detail
        available_count = PlantAsset.objects.filter(
            plant_detail=plant_detail,
            status=PlantAsset.AssetStatus.AVAILABLE,
        ).count()
        plant_detail.stock_quantity = available_count
        plant_detail.save(update_fields=["stock_quantity"])

        return created_assets

        return created_assets
