from django.urls import path
from apps.orders.views.carts import CartView, CartItemDetailView
from apps.orders.views.checkout import CheckoutView
from apps.orders.views.orders import OrderListView, OrderDetailView, OrderCancelView
from apps.orders.views.shipments import ShipmentListView

app_name = "orders"

urlpatterns = [
    # Cart
    path("cart/items/", CartView.as_view(), name="cart-items"),
    path("cart/items/<uuid:id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    # Checkout
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    # Orders
    path("", OrderListView.as_view(), name="order-list"),
    path("<uuid:id>/", OrderDetailView.as_view(), name="order-detail"),
    path("<uuid:id>/cancel/", OrderCancelView.as_view(), name="order-cancel"),
    # Shipments
    path("shipments/", ShipmentListView.as_view(), name="shipment-list"),
]
