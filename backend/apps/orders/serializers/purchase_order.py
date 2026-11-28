from rest_framework import serializers
from django.utils import timezone
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.catalog.serializers import PlantsDetailSerializer
from apps.payments.models import Transaction
from apps.payments.providers.vnpay import PAYMENT_WINDOW, vnpay_enabled
from apps.payments.services.vnpay import purchase_payment


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
    payment = serializers.SerializerMethodField()

    def get_payment(self, order):
        payment = purchase_payment(order)
        if payment is None:
            return None
        is_pending_vnpay = (
            payment.payment_method == Transaction.PaymentMethod.VNPAY
            and payment.status == Transaction.TransactionStatus.PENDING
        )
        expired = payment.transaction_date + PAYMENT_WINDOW <= timezone.now()
        return {
            "method": payment.payment_method,
            "status": payment.status,
            "can_resume": is_pending_vnpay and not expired and vnpay_enabled(),
            "expired": is_pending_vnpay and expired,
        }

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
            "shipping_fee",
            "payment",
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
