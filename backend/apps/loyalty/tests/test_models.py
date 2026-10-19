import pytest
from apps.accounts.models import User
from apps.loyalty.models.tier import LoyaltyTier, LoyaltyTierCode
from apps.loyalty.models.account import LoyaltyAccount


@pytest.mark.django_db
def test_loyalty_account():
    tier = LoyaltyTier.objects.create(code=LoyaltyTierCode.NEW, name="Mới", min_qualifying_spend_vnd=0)
    user = User.objects.create_user(email="loyal@plantify.vn", password="Password123!", full_name="Loyal User")
    account = LoyaltyAccount.objects.create(user=user, tier=tier, points_balance=100)
    assert account.points_balance == 100
    assert account.tier.code == LoyaltyTierCode.NEW
