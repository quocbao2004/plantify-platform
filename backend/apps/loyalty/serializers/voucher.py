from rest_framework import serializers
from apps.loyalty.models.voucher import Voucher
from apps.loyalty.models.user_voucher import UserVoucher


class VoucherSerializer(serializers.ModelSerializer):
    discount_type_display = serializers.CharField(source="get_discount_type_display", read_only=True)

    class Meta:
        model = Voucher
        fields = [
            "id",
            "code",
            "discount_type",
            "discount_type_display",
            "discount_value",
            "min_order_vnd",
            "max_discount_vnd",
            "points_cost",
            "valid_from",
            "valid_to",
        ]


class UserVoucherSerializer(serializers.ModelSerializer):
    voucher_info = VoucherSerializer(source="voucher", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = UserVoucher
        fields = ["id", "voucher", "voucher_info", "status", "status_display", "redeemed_at", "created_at"]
