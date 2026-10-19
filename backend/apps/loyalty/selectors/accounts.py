from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.models.point_transaction import PointTransaction
from apps.loyalty.models.tier import LoyaltyTier, LoyaltyTierCode


def get_user_loyalty_account(user: User) -> LoyaltyAccount:
    """Retrieve or create user loyalty account with default tier."""
    default_tier, _ = LoyaltyTier.objects.get_or_create(
        code=LoyaltyTierCode.NEW,
        defaults={"name": "Thành viên Mới", "min_qualifying_spend_vnd": 0},
    )
    account, _ = LoyaltyAccount.objects.select_related("tier").get_or_create(user=user, defaults={"tier": default_tier})
    return account


def get_user_point_transactions(account: LoyaltyAccount) -> QuerySet[PointTransaction]:
    return PointTransaction.objects.filter(account=account).order_by("-created_at")
