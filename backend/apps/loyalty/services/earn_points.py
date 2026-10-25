from django.db import transaction
from apps.accounts.models import User
from apps.orders.models.order import Order
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.models.tier import LoyaltyTier
from apps.loyalty.models.point_transaction import PointTransaction
from apps.loyalty.constants.choices import PointTransactionType


@transaction.atomic
def earn_points_from_order(user: User, order: Order, points: int, description: str = "") -> LoyaltyAccount:
    """Award loyalty points and evaluate tier upgrades."""
    idempotency_key = f"EARN-ORD-{order.order_code}"
    if PointTransaction.objects.filter(idempotency_key=idempotency_key).exists():
        return user.loyalty_account

    account, _ = LoyaltyAccount.objects.select_for_update().get_or_create(user=user)
    account.points_balance += points
    account.qualifying_spend_vnd += order.payable_total_vnd

    # Check tier upgrade
    eligible_tier = (
        LoyaltyTier.objects.filter(min_qualifying_spend_vnd__lte=account.qualifying_spend_vnd)
        .order_by("-min_qualifying_spend_vnd")
        .first()
    )
    if eligible_tier:
        account.tier = eligible_tier

    account.save(update_fields=["points_balance", "qualifying_spend_vnd", "tier", "updated_at"])

    PointTransaction.objects.create(
        account=account,
        order=order,
        type=PointTransactionType.EARN,
        points_delta=points,
        description=description or f"Tích điểm từ đơn hàng #{order.order_code}",
        idempotency_key=idempotency_key,
    )
    return account
