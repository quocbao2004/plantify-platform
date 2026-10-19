from rest_framework import generics
from apps.common.permissions.is_staff import IsStaffUser
from apps.loyalty.models.tier import LoyaltyTier
from apps.loyalty.serializers.account import LoyaltyTierSerializer


class AdminTierListView(generics.ListCreateAPIView):
    permission_classes = [IsStaffUser]
    serializer_class = LoyaltyTierSerializer
    queryset = LoyaltyTier.objects.all().order_by("min_qualifying_spend_vnd")
