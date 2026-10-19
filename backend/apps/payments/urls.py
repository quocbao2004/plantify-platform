from django.urls import path
from apps.payments.views.payments import PaymentListView, PaymentDetailView
from apps.payments.views.refunds import RefundListView
from apps.payments.views.webhooks import PaymentWebhookView

app_name = "payments"

urlpatterns = [
    path("", PaymentListView.as_view(), name="payment-list"),
    path("<uuid:id>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("webhooks/<str:provider>/", PaymentWebhookView.as_view(), name="payment-webhook"),
    path("refunds/", RefundListView.as_view(), name="refund-list"),
]
