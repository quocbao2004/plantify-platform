from django.urls import path
from apps.orders.views import (
    PurchaseOrderListCreateView,
    PurchaseOrderDetailView,
    PurchaseOrderDetailItemListCreateView,
    ReturnRequestListCreateView,
    ReturnRequestDetailView,
    ShipmentListCreateView,
    ShipmentDetailView,
    ShipperListView,
)
from apps.orders.views.checkout import CartQuoteView, CheckoutView

app_name = "orders"

urlpatterns = [
    path("cart/quote/", CartQuoteView.as_view(), name="cart-quote"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),

    # Purchase Orders (Customer & Staff)
    path("purchase-orders/", PurchaseOrderListCreateView.as_view(), name="purchase-order-list"),
    path("purchase-orders/<uuid:pk>/", PurchaseOrderDetailView.as_view(), name="purchase-order-detail"),
    path("purchase-order-details/", PurchaseOrderDetailItemListCreateView.as_view(), name="purchase-order-detail-items"),

    # Admin Aliases
    path("admin/orders/", PurchaseOrderListCreateView.as_view(), name="admin-order-list"),
    path("admin/orders/<uuid:pk>/", PurchaseOrderDetailView.as_view(), name="admin-order-detail"),

    # Return & Exchange Requests
    path("return-requests/", ReturnRequestListCreateView.as_view(), name="return-request-list"),
    path("return-requests/<uuid:pk>/", ReturnRequestDetailView.as_view(), name="return-request-detail"),
    path("admin/returns/", ReturnRequestListCreateView.as_view(), name="admin-return-list"),
    path("admin/returns/<uuid:pk>/", ReturnRequestDetailView.as_view(), name="admin-return-detail"),

    # Shipments & Logistics Dispatch
    path("shipments/", ShipmentListCreateView.as_view(), name="shipment-list"),
    path("shipments/<uuid:pk>/", ShipmentDetailView.as_view(), name="shipment-detail"),
    path("admin/shipments/", ShipmentListCreateView.as_view(), name="admin-shipment-list"),
    path("admin/shipments/<uuid:pk>/", ShipmentDetailView.as_view(), name="admin-shipment-detail"),
    path("admin/shippers/", ShipperListView.as_view(), name="admin-shipper-list"),
]
