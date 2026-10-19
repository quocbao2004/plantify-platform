from django.contrib import admin
from apps.orders.models.cart import Cart, CartItem
from apps.orders.models.order import Order
from apps.orders.models.order_item import OrderItem
from apps.orders.models.stock_reservation import StockReservation
from apps.orders.models.shipment import Shipment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product_name_snapshot",
        "sku_snapshot",
        "unit_price_vnd",
        "line_total_vnd",
        "deposit_total_vnd",
    )


class ShipmentInline(admin.TabularInline):
    model = Shipment
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_code", "user", "status", "payable_total_vnd", "placed_at")
    list_filter = ("status", "placed_at")
    search_fields = ("order_code", "user__email")
    inlines = [OrderItemInline, ShipmentInline]


@admin.register(StockReservation)
class StockReservationAdmin(admin.ModelAdmin):
    list_display = ("order_item", "variant", "quantity", "status", "expires_at")
    list_filter = ("status",)
