from django.urls import path
from apps.loyalty.views.accounts import MyLoyaltyAccountView, MyPointTransactionsView
from apps.loyalty.views.vouchers import PublicVoucherListView, MyVouchersListView, RedeemVoucherView
from apps.loyalty.views.admin_rules import AdminTierListView

app_name = "loyalty"

urlpatterns = [
    path("me/", MyLoyaltyAccountView.as_view(), name="loyalty-me"),
    path("transactions/", MyPointTransactionsView.as_view(), name="loyalty-transactions"),
    path("vouchers/", PublicVoucherListView.as_view(), name="voucher-list"),
    path("my-vouchers/", MyVouchersListView.as_view(), name="my-vouchers"),
    path("vouchers/<uuid:voucher_id>/redeem/", RedeemVoucherView.as_view(), name="voucher-redeem"),
    path("tiers/", AdminTierListView.as_view(), name="tier-list"),
]
