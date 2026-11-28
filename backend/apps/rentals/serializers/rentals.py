from rest_framework import serializers
from apps.rentals.models import (
    RentalOrder,
    RentalOrderDetail,
    RentalContract,
    MaintenanceTask,
    ShipPlants,
)
from apps.catalog.serializers import PlantsDetailSerializer
from apps.accounts.serializers import StaffSerializer


class RentalOrderDetailSerializer(serializers.ModelSerializer):
    plant_detail_info = PlantsDetailSerializer(source="plant_detail", read_only=True)

    class Meta:
        model = RentalOrderDetail
        fields = [
            "id",
            "rental_order",
            "plant_detail",
            "plant_detail_info",
            "quantity",
            "rental_price",
            "rental_duration_days",
            "total_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MaintenanceTaskSerializer(serializers.ModelSerializer):
    staff_info = StaffSerializer(source="staff", read_only=True)

    class Meta:
        model = MaintenanceTask
        fields = [
            "id",
            "rental_contract",
            "staff",
            "staff_info",
            "task_code",
            "title",
            "scheduled_date",
            "completed_date",
            "status",
            "health_status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ShipPlantsSerializer(serializers.ModelSerializer):
    staff_info = StaffSerializer(source="staff", read_only=True)
    staff_name = serializers.CharField(source="staff.user.full_name", read_only=True, default="")
    staff_phone = serializers.CharField(source="staff.user.phone", read_only=True, default="")
    shipper_name = serializers.CharField(source="staff.user.full_name", read_only=True, default="")
    shipper_phone = serializers.CharField(source="staff.user.phone", read_only=True, default="")
    order_code = serializers.SerializerMethodField()
    order_total = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    plant_names = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ShipPlants
        fields = [
            "id",
            "purchase_order",
            "rental_contract",
            "order_code",
            "order_total",
            "staff",
            "staff_info",
            "staff_name",
            "staff_phone",
            "shipper_name",
            "shipper_phone",
            "ship_code",
            "ship_type",
            "status",
            "status_display",
            "scheduled_date",
            "delivered_date",
            "confirmed_date",
            "delivery_address",
            "recipient_name",
            "recipient_phone",
            "cod_amount",
            "cod_collected",
            "proof_image",
            "shipper_notes",
            "admin_notes",
            "notes",
            "items_count",
            "plant_names",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "ship_code", "created_at", "updated_at"]

    def to_internal_value(self, data):
        if hasattr(data, "copy"):
            data = data.copy()
        elif isinstance(data, dict):
            data = dict(data)
        if isinstance(data, dict) and "shipper" in data and "staff" not in data:
            data["staff"] = data["shipper"]
        if isinstance(data, dict) and data.get("staff"):
            from apps.accounts.models import Staff, User
            from apps.accounts.constants.choices import UserRole

            staff_val = str(data["staff"])
            if not Staff.objects.filter(pk=staff_val).exists():
                user_obj = User.objects.filter(
                    pk=staff_val,
                    is_active=True,
                    role__in=[UserRole.DELIVERY, UserRole.STAFF, UserRole.ADMIN],
                ).first()
                if user_obj:
                    staff_obj, _ = Staff.objects.get_or_create(
                        user=user_obj,
                        defaults={
                            "staff_code": f"NV-{str(user_obj.id)[:8].upper()}",
                            "position": user_obj.role,
                            "is_available": True,
                        },
                    )
                    data["staff"] = str(staff_obj.id)
        return super().to_internal_value(data)

    def get_order_code(self, obj):
        if obj.purchase_order:
            return obj.purchase_order.order_code
        if obj.rental_contract:
            return obj.rental_contract.contract_code
        return ""

    def get_order_total(self, obj):
        if obj.purchase_order:
            return obj.purchase_order.total_amount
        if obj.rental_contract:
            return obj.rental_contract.total_value
        return 0

    def get_items_count(self, obj):
        if obj.purchase_order and hasattr(obj.purchase_order, "details"):
            return obj.purchase_order.details.count()
        if obj.rental_contract and obj.rental_contract.rental_order:
            return obj.rental_contract.rental_order.details.count()
        return 0

    def get_plant_names(self, obj):
        names = []
        if obj.purchase_order and hasattr(obj.purchase_order, "details"):
            for d in obj.purchase_order.details.all()[:3]:
                if d.plant_detail and d.plant_detail.plant:
                    names.append(d.plant_detail.plant.name)
        elif obj.rental_contract and obj.rental_contract.rental_order:
            for d in obj.rental_contract.rental_order.details.all()[:3]:
                if d.plant_detail and d.plant_detail.plant:
                    names.append(d.plant_detail.plant.name)
        return names


class RentalContractSerializer(serializers.ModelSerializer):
    maintenance_tasks = MaintenanceTaskSerializer(many=True, read_only=True)
    ship_tasks = ShipPlantsSerializer(many=True, read_only=True)

    class Meta:
        model = RentalContract
        fields = [
            "id",
            "rental_order",
            "contract_code",
            "signed_date",
            "start_date",
            "end_date",
            "total_value",
            "deposit_amount",
            "status",
            "terms_and_conditions",
            "contract_file_url",
            "maintenance_tasks",
            "ship_tasks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RentalOrderSerializer(serializers.ModelSerializer):
    details = RentalOrderDetailSerializer(many=True, read_only=True)
    contract = RentalContractSerializer(read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = RentalOrder
        fields = [
            "id",
            "user",
            "user_email",
            "order_code",
            "start_date",
            "end_date",
            "total_rental_amount",
            "deposit_amount",
            "status",
            "delivery_address",
            "recipient_name",
            "recipient_phone",
            "notes",
            "details",
            "contract",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
