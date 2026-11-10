from django.contrib import admin
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


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ("refund_code", "transaction", "amount", "status", "processed_by", "processed_at")
    list_filter = ("status", "created_at")
    search_fields = ("refund_code", "transaction__transaction_code", "reason")
