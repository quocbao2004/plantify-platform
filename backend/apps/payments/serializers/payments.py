from rest_framework import serializers
from apps.payments.models import Transaction, Refund


class RefundSerializer(serializers.ModelSerializer):
    processed_by_email = serializers.CharField(source="processed_by.email", read_only=True)

    class Meta:
        model = Refund
        fields = [
            "id",
            "transaction",
            "refund_code",
            "amount",
            "reason",
            "status",
            "processed_by",
            "processed_by_email",
            "processed_at",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TransactionSerializer(serializers.ModelSerializer):
    refunds = RefundSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user",
            "user_email",
            "purchase_order",
            "rental_contract",
            "transaction_code",
            "amount",
            "transaction_type",
            "payment_method",
            "status",
            "payment_gateway_response",
            "transaction_date",
            "refunds",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
