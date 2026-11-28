from django.urls import path
from apps.payments.views import (
    TransactionListCreateView,
    TransactionDetailView,
    RefundListCreateView,
    RefundDetailView,
)
from apps.payments.views.vnpay import VNPayIPNView, VNPayResumeView, VNPayReturnView

app_name = "payments"

urlpatterns = [
    path("vnpay/ipn/", VNPayIPNView.as_view(), name="vnpay-ipn"),
    path("vnpay/return/", VNPayReturnView.as_view(), name="vnpay-return"),
    path("vnpay/<uuid:order_id>/resume/", VNPayResumeView.as_view(), name="vnpay-resume"),
    path("transactions/", TransactionListCreateView.as_view(), name="transaction-list"),
    path("transactions/<uuid:pk>/", TransactionDetailView.as_view(), name="transaction-detail"),
    path("refunds/", RefundListCreateView.as_view(), name="refund-list"),
    path("refunds/<uuid:pk>/", RefundDetailView.as_view(), name="refund-detail"),
]
