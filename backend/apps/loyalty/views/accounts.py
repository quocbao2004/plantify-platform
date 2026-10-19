from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.loyalty.serializers.account import LoyaltyAccountSerializer
from apps.loyalty.serializers.transactions import PointTransactionSerializer
from apps.loyalty.selectors.accounts import get_user_loyalty_account, get_user_point_transactions


class MyLoyaltyAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account = get_user_loyalty_account(request.user)
        return Response({"success": True, "data": LoyaltyAccountSerializer(account).data})


class MyPointTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account = get_user_loyalty_account(request.user)
        transactions = get_user_point_transactions(account)
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response({"success": True, "data": serializer.data})
