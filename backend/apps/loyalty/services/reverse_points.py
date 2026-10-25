from django.db import transaction
from apps.orders.models.order import Order
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.models.point_transaction import PointTransaction
from apps.loyalty.constants.choices import PointTransactionType


@transaction.atomic
def reverse_order_points(order: Order, reason: str = "") -> None:
    """Reverse points upon cancellation or full refund without deleting history."""
    earn_tx = PointTransaction.objects.filter(order=order, type=PointTransactionType.EARN).first()
    if not earn_tx:
        return

    reverse_key = f"REV-ORD-{order.order_code}"
    if PointTransaction.objects.filter(idempotency_key=reverse_key).exists():
        return

    account = LoyaltyAccount.objects.select_for_update().get(id=earn_tx.account_id)
    points_to_revert = earn_tx.points_delta

    account.points_balance = max(0, account.points_balance - points_to_revert)
    account.qualifying_spend_vnd = max(0, account.qualifying_spend_vnd - order.payable_total_vnd)
    account.save(update_fields=["points_balance", "qualifying_spend_vnd", "updated_at"])

    PointTransaction.objects.create(
        account=account,
        order=order,
        type=PointTransactionType.REVERSE,
        points_delta=-points_to_revert,
        description=reason or f"Đảo điểm do hủy/hoàn đơn #{order.order_code}",
        idempotency_key=reverse_key,
    )
