from django.db import transaction
from django.utils import timezone
from apps.orders.models.order import Order
from apps.orders.models.shipment import Shipment
from apps.orders.constants.choices import OrderStatus, StockReservationStatus, ShipmentStatus
from apps.inventory.services.commit_sale import commit_sale_dispatch
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def dispatch_order_shipment(order: Order, carrier: str = "", tracking_code: str = "", performed_by=None) -> Shipment:
    """Commit stock and mark order as SHIPPING."""
    if order.status not in [OrderStatus.CONFIRMED, OrderStatus.PROCESSING]:
        raise BusinessRuleError("Đơn hàng chưa đủ điều kiện xuất kho giao hàng.")

    # 1. Commit reserved stock
    for item in order.items.select_related("reservation"):
        if hasattr(item, "reservation") and item.reservation.status == StockReservationStatus.PENDING:
            commit_sale_dispatch(
                variant_id=item.variant.id,
                quantity=item.reservation.quantity,
                order_id=order.id,
                performed_by=performed_by,
            )
            item.reservation.status = StockReservationStatus.COMMITTED
            item.reservation.save(update_fields=["status", "updated_at"])

    order.status = OrderStatus.SHIPPING
    order.save(update_fields=["status", "updated_at"])

    shipment = Shipment.objects.create(
        order=order,
        carrier=carrier,
        tracking_code=tracking_code,
        status=ShipmentStatus.IN_TRANSIT,
        shipped_at=timezone.now(),
    )
    return shipment
