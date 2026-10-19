from rest_framework import serializers
from apps.orders.models.order import Order
from apps.orders.models.order_item import OrderItem


class OrderItemReadSerializer(serializers.ModelSerializer):
    item_type_display = serializers.CharField(source="get_item_type_display", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "variant",
            "item_type",
            "item_type_display",
            "quantity",
            "product_name_snapshot",
            "sku_snapshot",
            "unit_price_vnd",
            "line_total_vnd",
            "deposit_total_vnd",
            "rental_start_at",
            "rental_end_at",
        ]


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_code",
            "status",
            "status_display",
            "currency",
            "subtotal_sale_vnd",
            "subtotal_rent_vnd",
            "deposit_total_vnd",
            "shipping_fee_vnd",
            "discount_total_vnd",
            "payable_total_vnd",
            "shipping_address_snapshot",
            "placed_at",
            "items",
            "created_at",
        ]
        read_only_fields = fields
