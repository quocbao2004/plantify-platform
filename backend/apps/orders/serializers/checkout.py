from rest_framework import serializers


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.DictField(
        child=serializers.CharField(),
        help_text="Snapshot địa chỉ giao hàng: recipient_name, phone, address_line, ward, province",
    )
    payment_method = serializers.ChoiceField(
        choices=["COD", "BANK_TRANSFER", "VNPAY", "MOMO", "ZALOPAY"],
        default="COD",
    )
    note = serializers.CharField(required=False, allow_blank=True)
