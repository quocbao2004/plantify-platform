from django.contrib import admin
from apps.orders.models import PurchaseOrder
from apps.payments.models import Transaction, Refund


class RefundInline(admin.TabularInline):
    model = Refund
    extra = 0


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "transaction_code",
        "user",
        "amount",
        "transaction_type",
        "payment_method",
        "status",
        "transaction_date",
    )
    list_filter = ("status", "transaction_type", "payment_method", "transaction_date")
    search_fields = ("transaction_code", "user__email", "purchase_order__order_code", "rental_contract__contract_code")
    inlines = [RefundInline]

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "purchase_order":
            return PurchaseOrder.objects.using(db).filter(checkout_key__isnull=True)
        return super().get_field_queryset(db, db_field, request)

    def has_change_permission(self, request, obj=None):
        if obj and obj.purchase_order and obj.purchase_order.checkout_key:
            return False
        return super().has_change_permission(request, obj)

    def delete_queryset(self, request, queryset):
        super().delete_queryset(request, queryset.filter(purchase_order__checkout_key__isnull=True))

    def has_delete_permission(self, request, obj=None):
        if obj and obj.purchase_order and obj.purchase_order.checkout_key:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ("refund_code", "transaction", "amount", "status", "processed_by", "processed_at")
    list_filter = ("status", "created_at")
    search_fields = ("refund_code", "transaction__transaction_code", "reason")
