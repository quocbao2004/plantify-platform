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

    class Meta:
        model = ShipPlants
        fields = [
            "id",
            "rental_contract",
            "staff",
            "staff_info",
            "ship_code",
            "ship_type",
            "scheduled_date",
            "delivered_date",
            "status",
            "delivery_address",
            "recipient_name",
            "recipient_phone",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


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
