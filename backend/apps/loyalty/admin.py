from django.contrib import admin
from apps.loyalty.models.tier import LoyaltyTier
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.models.point_transaction import PointTransaction
from apps.loyalty.models.voucher import Voucher
from apps.loyalty.models.user_voucher import UserVoucher


@admin.register(LoyaltyTier)
class LoyaltyTierAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "min_qualifying_spend_vnd")


@admin.register(LoyaltyAccount)
class LoyaltyAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "tier", "points_balance", "qualifying_spend_vnd")
    search_fields = ("user__email",)


@admin.register(PointTransaction)
class PointTransactionAdmin(admin.ModelAdmin):
    list_display = ("account", "type", "points_delta", "order", "created_at")
    list_filter = ("type",)


@admin.register(Voucher)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_type", "discount_value", "valid_from", "valid_to", "usage_limit")
    search_fields = ("code",)


@admin.register(UserVoucher)
class UserVoucherAdmin(admin.ModelAdmin):
    list_display = ("user", "voucher", "status", "redeemed_at")
    list_filter = ("status",)
