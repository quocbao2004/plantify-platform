from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.orders.models.order import Order


def get_user_orders(user: User) -> QuerySet[Order]:
    """Retrieve orders of a user with items and shipments preloaded."""
    return Order.objects.filter(user=user).prefetch_related("items", "shipments").order_by("-placed_at")


def get_order_by_id(order_id: str, user: Optional[User] = None) -> Optional[Order]:
    """Retrieve single order by UUID, with optional user scope."""
    qs = Order.objects.filter(id=order_id).prefetch_related("items", "shipments")
    if user and not user.is_staff:
        qs = qs.filter(user=user)
    return qs.first()
