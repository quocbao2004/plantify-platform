from django.db import transaction
from apps.orders.models.order import Order
from apps.orders.constants.choices import OrderStatus, StockReservationStatus
from apps.inventory.services.release_stock import release_stock_reservation
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def cancel_pending_order(order: Order, reason: str = "") -> Order:
    """Cancel order and release reserved stock safely."""
    if order.status not in [OrderStatus.PENDING_PAYMENT, OrderStatus.CONFIRMED]:
        raise BusinessRuleError("Chỉ có thể hủy đơn hàng đang chờ thanh toán hoặc chưa xuất kho.")

    order.status = OrderStatus.CANCELLED
    order.save(update_fields=["status", "updated_at"])

    # Release any active stock reservations
    for item in order.items.select_related("reservation"):
        if hasattr(item, "reservation") and item.reservation.status == StockReservationStatus.PENDING:
            release_stock_reservation(item.variant.id, item.reservation.quantity)
            item.reservation.status = StockReservationStatus.RELEASED
            item.reservation.save(update_fields=["status", "updated_at"])

    return order
