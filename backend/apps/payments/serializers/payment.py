from rest_framework import serializers
from apps.payments.models.payment import Payment
from apps.payments.models.payment_allocation import PaymentAllocation


class PaymentAllocationSerializer(serializers.ModelSerializer):
    component_display = serializers.CharField(source="get_component_display", read_only=True)

    class Meta:
        model = PaymentAllocation
        fields = ["id", "component", "component_display", "amount_vnd", "order_item"]


class PaymentSerializer(serializers.ModelSerializer):
    allocations = PaymentAllocationSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    method_display = serializers.CharField(source="get_method_display", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "rental_contract",
            "purpose",
            "amount_vnd",
            "method",
            "method_display",
            "status",
            "status_display",
            "idempotency_key",
            "paid_at",
            "allocations",
            "created_at",
        ]
        read_only_fields = ["id", "status", "paid_at", "allocations", "created_at"]
