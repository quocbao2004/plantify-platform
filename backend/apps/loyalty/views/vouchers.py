from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.loyalty.serializers.voucher import VoucherSerializer, UserVoucherSerializer
from apps.loyalty.selectors.vouchers import get_available_public_vouchers, get_user_vouchers
from apps.loyalty.services.issue_voucher import issue_voucher_for_points


class PublicVoucherListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        vouchers = get_available_public_vouchers()
        serializer = VoucherSerializer(vouchers, many=True)
        return Response({"success": True, "data": serializer.data})


class MyVouchersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_vouchers = get_user_vouchers(request.user)
        serializer = UserVoucherSerializer(user_vouchers, many=True)
        return Response({"success": True, "data": serializer.data})


class RedeemVoucherView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, voucher_id):
        user_voucher = issue_voucher_for_points(request.user, voucher_id)
        return Response(
            {
                "success": True,
                "message": "Đổi voucher thành công.",
                "data": UserVoucherSerializer(user_voucher).data,
            },
            status=status.HTTP_201_CREATED,
        )
