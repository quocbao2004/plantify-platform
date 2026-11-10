from django.contrib import admin
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail


class PurchaseOrderDetailInline(admin.TabularInline):
    model = PurchaseOrderDetail
    extra = 0


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("order_code", "user", "status", "total_amount", "recipient_name", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_code", "user__email", "recipient_name", "recipient_phone")
    inlines = [PurchaseOrderDetailInline]


@admin.register(PurchaseOrderDetail)
class PurchaseOrderDetailAdmin(admin.ModelAdmin):
    list_display = ("purchase_order", "plant_detail", "quantity", "unit_price", "total_price")
    search_fields = ("purchase_order__order_code", "plant_detail__sku")
