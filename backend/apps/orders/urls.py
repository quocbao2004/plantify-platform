from django.urls import path
from apps.orders.views import (
    PurchaseOrderListCreateView,
    PurchaseOrderDetailView,
    PurchaseOrderDetailItemListCreateView,
)

app_name = "orders"

urlpatterns = [
    path("purchase-orders/", PurchaseOrderListCreateView.as_view(), name="purchase-order-list"),
    path("purchase-orders/<uuid:pk>/", PurchaseOrderDetailView.as_view(), name="purchase-order-detail"),
    path("purchase-order-details/", PurchaseOrderDetailItemListCreateView.as_view(), name="purchase-order-detail-items"),
]
