from django.db import transaction
from apps.accounts.models import User
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.models.point_transaction import PointTransaction
from apps.loyalty.constants.choices import PointTransactionType
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def redeem_user_points(user: User, points: int, description: str, idempotency_key: str) -> LoyaltyAccount:
    """Safely deduct points using row-level lock."""
    if points <= 0:
        raise BusinessRuleError("Số điểm trừ phải lớn hơn 0.")

    if PointTransaction.objects.filter(idempotency_key=idempotency_key).exists():
        return user.loyalty_account

    account = LoyaltyAccount.objects.select_for_update().get(user=user)
    if account.points_balance < points:
        raise BusinessRuleError(f"Bạn chỉ có {account.points_balance} điểm, không đủ để trừ {points} điểm.")

    account.points_balance -= points
    account.save(update_fields=["points_balance", "updated_at"])

    PointTransaction.objects.create(
        account=account,
        type=PointTransactionType.REDEEM,
        points_delta=-points,
        description=description,
        idempotency_key=idempotency_key,
    )
    return account
