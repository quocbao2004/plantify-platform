from django.urls import path
from apps.payments.views import (
    TransactionListCreateView,
    TransactionDetailView,
    RefundListCreateView,
    RefundDetailView,
)

app_name = "payments"

urlpatterns = [
    path("transactions/", TransactionListCreateView.as_view(), name="transaction-list"),
    path("transactions/<uuid:pk>/", TransactionDetailView.as_view(), name="transaction-detail"),
    path("refunds/", RefundListCreateView.as_view(), name="refund-list"),
    path("refunds/<uuid:pk>/", RefundDetailView.as_view(), name="refund-detail"),
]
