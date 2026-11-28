from apps.orders.models import PurchaseOrder
from apps.payments.models import Transaction
from apps.rentals.models.ship_plants import ShipPlants


def ensure_shipment_for_purchase_order(order: PurchaseOrder) -> ShipPlants:
    """
    Ensure an active ShipPlants record exists for a PurchaseOrder in DELIVERING state.
    """
    existing = (
        ShipPlants.objects.filter(purchase_order=order)
        .exclude(status=ShipPlants.ShipStatus.CANCELLED)
        .first()
    )
    if existing:
        return existing

    payment = order.transactions.filter(
        transaction_type=Transaction.TransactionType.PURCHASE,
    ).first()
    is_cod = bool(
        payment
        and payment.payment_method == Transaction.PaymentMethod.CASH
        and payment.status != Transaction.TransactionStatus.SUCCESS
    )

    return ShipPlants.objects.create(
        purchase_order=order,
        ship_type=ShipPlants.ShipType.PURCHASE,
        status=ShipPlants.ShipStatus.PENDING,
        delivery_address=order.shipping_address,
        recipient_name=order.recipient_name,
        recipient_phone=order.recipient_phone,
        cod_amount=order.total_amount if is_cod else 0,
        notes=order.notes or "",
    )


def cancel_shipments_for_purchase_order(order: PurchaseOrder) -> None:
    """
    Cancel any pending or in-progress ShipPlants records when a PurchaseOrder is cancelled.
    """
    ShipPlants.objects.filter(purchase_order=order).exclude(
        status__in=[ShipPlants.ShipStatus.DELIVERED, ShipPlants.ShipStatus.CANCELLED]
    ).update(status=ShipPlants.ShipStatus.CANCELLED)


def sync_delivering_purchase_orders() -> None:
    """
    Backfill ShipPlants records for any PurchaseOrder already in DELIVERING
    that does not yet have an active ShipPlants record.
    """
    delivering_orders = (
        PurchaseOrder.objects.filter(status=PurchaseOrder.OrderStatus.DELIVERING)
        .exclude(
            ship_tasks__status__in=[
                ShipPlants.ShipStatus.PENDING,
                ShipPlants.ShipStatus.ASSIGNED,
                ShipPlants.ShipStatus.SHIPPING,
                ShipPlants.ShipStatus.DELIVERED_PENDING_CONFIRM,
                ShipPlants.ShipStatus.DELIVERED,
            ]
        )
        .prefetch_related("transactions")
    )
    for order in delivering_orders:
        ensure_shipment_for_purchase_order(order)
