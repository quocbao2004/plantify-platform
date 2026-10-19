from django.db import transaction
from apps.orders.models.order import Order
from apps.orders.constants.choices import OrderStatus


@transaction.atomic
def confirm_order_payment_received(order: Order) -> Order:
    """Transition order to CONFIRMED after payment or COD placement."""
    order.status = OrderStatus.CONFIRMED
    order.save(update_fields=["status", "updated_at"])
    return order
