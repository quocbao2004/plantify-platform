from django.contrib import admin
from apps.payments.models.payment import Payment
from apps.payments.models.payment_attempt import PaymentAttempt
from apps.payments.models.payment_allocation import PaymentAllocation
from apps.payments.models.refund import Refund
from apps.payments.models.deposit_ledger import DepositLedgerEntry


class PaymentAllocationInline(admin.TabularInline):
    model = PaymentAllocation
    extra = 0
    readonly_fields = ("component", "amount_vnd", "order_item")


class PaymentAttemptInline(admin.TabularInline):
    model = PaymentAttempt
    extra = 0
    readonly_fields = ("provider", "provider_transaction_id", "status", "occurred_at")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "purpose", "amount_vnd", "method", "status", "paid_at")
    list_filter = ("status", "method", "purpose")
    search_fields = ("order__order_code", "idempotency_key")
    inlines = [PaymentAllocationInline, PaymentAttemptInline]


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ("id", "payment", "amount_vnd", "status", "processed_at")
    list_filter = ("status",)


@admin.register(DepositLedgerEntry)
class DepositLedgerEntryAdmin(admin.ModelAdmin):
    list_display = ("rental_contract", "entry_type", "amount_vnd", "created_at")
    list_filter = ("entry_type",)
