from django.contrib import admin, messages
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail, ReturnRequest
from apps.orders.services.checkout import update_order_status


class PurchaseOrderDetailInline(admin.TabularInline):
    model = PurchaseOrderDetail
    extra = 0

    def has_add_permission(self, request, obj=None):
        return (obj is None or obj.checkout_key is None) and super().has_add_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        return (obj is None or obj.checkout_key is None) and super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return (obj is None or obj.checkout_key is None) and super().has_delete_permission(request, obj)


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("order_code", "user", "status", "total_amount", "recipient_name", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order_code", "user__email", "recipient_name", "recipient_phone")
    inlines = [PurchaseOrderDetailInline]
    actions = ["start_packing", "send_delivery", "complete_cod", "cancel_cod"]

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.checkout_key:
            return [field.name for field in self.model._meta.fields if field.editable]
        return super().get_readonly_fields(request, obj)

    def has_delete_permission(self, request, obj=None):
        return obj is not None and obj.checkout_key is None and super().has_delete_permission(request, obj)

    def change_order_status(self, request, queryset, status):
        updated = sum(
            update_order_status(order_id, status)
            for order_id in queryset.filter(checkout_key__isnull=False).values_list("pk", flat=True)
        )
        if updated:
            self.message_user(request, f"Đã cập nhật {updated} đơn hàng.")
        else:
            self.message_user(request, "Không có đơn hàng ở trạng thái phù hợp.", messages.WARNING)

    @admin.action(description="Chuyển đơn sang đóng gói", permissions=["change"])
    def start_packing(self, request, queryset):
        self.change_order_status(request, queryset, PurchaseOrder.OrderStatus.PROCESSING)

    @admin.action(description="Chuyển đơn sang đang giao", permissions=["change"])
    def send_delivery(self, request, queryset):
        self.change_order_status(request, queryset, PurchaseOrder.OrderStatus.DELIVERING)

    @admin.action(description="Xác nhận đã giao (đã thu tiền nếu là COD)", permissions=["change"])
    def complete_cod(self, request, queryset):
        self.change_order_status(request, queryset, PurchaseOrder.OrderStatus.COMPLETED)

    @admin.action(description="Hủy đơn COD và hoàn tồn kho", permissions=["change"])
    def cancel_cod(self, request, queryset):
        self.change_order_status(request, queryset, PurchaseOrder.OrderStatus.CANCELLED)


@admin.register(PurchaseOrderDetail)
class PurchaseOrderDetailAdmin(admin.ModelAdmin):
    list_display = ("purchase_order", "plant_detail", "quantity", "unit_price", "total_price")
    search_fields = ("purchase_order__order_code", "plant_detail__sku")

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "purchase_order":
            return PurchaseOrder.objects.using(db).filter(checkout_key__isnull=True)
        return super().get_field_queryset(db, db_field, request)

    def has_change_permission(self, request, obj=None):
        return (obj is None or obj.purchase_order.checkout_key is None) and super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return obj is not None and obj.purchase_order.checkout_key is None and super().has_delete_permission(request, obj)


@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = ("return_code", "order", "user", "request_type", "reason", "status", "quantity", "created_at")
    list_filter = ("status", "request_type", "reason", "created_at")
    search_fields = ("return_code", "order__order_code", "user__email", "user__full_name", "user__phone")
