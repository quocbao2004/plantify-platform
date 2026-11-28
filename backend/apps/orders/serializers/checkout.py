from rest_framework import serializers


class CartLineSerializer(serializers.Serializer):
    plant_detail = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class CartQuoteSerializer(serializers.Serializer):
    items = CartLineSerializer(many=True, allow_empty=False, max_length=50)

    def validate_items(self, items):
        if len({item["plant_detail"] for item in items}) != len(items):
            raise serializers.ValidationError("Mỗi kích cỡ cây chỉ được xuất hiện một lần.")
        return items


class CheckoutLineSerializer(CartLineSerializer):
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)


class CheckoutSerializer(CartQuoteSerializer):
    items = CheckoutLineSerializer(many=True, allow_empty=False, max_length=50)
    checkout_key = serializers.UUIDField()
    payment_method = serializers.ChoiceField(choices=["CASH", "VNPAY"], default="CASH")
    shipping_fee = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    recipient_name = serializers.CharField(max_length=255)
    recipient_phone = serializers.RegexField(
        r"^(?:0[35789][0-9]{8}|\+?84[35789][0-9]{8})$",
        max_length=20,
        error_messages={"invalid": "Số điện thoại Việt Nam không hợp lệ."},
    )
    shipping_address = serializers.CharField(max_length=500)
    notes = serializers.CharField(max_length=1000, allow_blank=True, default="")
