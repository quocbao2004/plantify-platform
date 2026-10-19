from rest_framework import serializers
from apps.loyalty.models.tier import LoyaltyTier
from apps.loyalty.models.account import LoyaltyAccount


class LoyaltyTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyTier
        fields = ["id", "code", "name", "min_qualifying_spend_vnd", "benefits"]


class LoyaltyAccountSerializer(serializers.ModelSerializer):
    tier_info = LoyaltyTierSerializer(source="tier", read_only=True)

    class Meta:
        model = LoyaltyAccount
        fields = [
            "id",
            "tier",
            "tier_info",
            "points_balance",
            "qualifying_spend_vnd",
            "updated_at",
        ]
        read_only_fields = fields
