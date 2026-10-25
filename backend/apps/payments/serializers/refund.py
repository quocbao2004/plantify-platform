from rest_framework import serializers
from apps.payments.models.refund import Refund


class RefundSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Refund
        fields = [
            "id",
            "payment",
            "rental_contract",
            "amount_vnd",
            "reason",
            "status",
            "status_display",
            "provider_refund_id",
            "processed_at",
            "created_at",
        ]
        read_only_fields = ["id", "status", "provider_refund_id", "processed_at", "created_at"]
