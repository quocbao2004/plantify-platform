from django.urls import path
from apps.orders.views import (
    PurchaseOrderListCreateView,
    PurchaseOrderDetailView,
    PurchaseOrderDetailItemListCreateView,
)

app_name = "orders"

urlpatterns = [
    # Purchase Orders (Customer & Staff)
    path("purchase-orders/", PurchaseOrderListCreateView.as_view(), name="purchase-order-list"),
    path("purchase-orders/<uuid:pk>/", PurchaseOrderDetailView.as_view(), name="purchase-order-detail"),
    path("purchase-order-details/", PurchaseOrderDetailItemListCreateView.as_view(), name="purchase-order-detail-items"),

    # Admin Aliases
    path("admin/orders/", PurchaseOrderListCreateView.as_view(), name="admin-order-list"),
    path("admin/orders/<uuid:pk>/", PurchaseOrderDetailView.as_view(), name="admin-order-detail"),
]
