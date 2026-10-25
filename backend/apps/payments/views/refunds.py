from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.payments.serializers.refund import RefundSerializer
from apps.payments.selectors.refunds import get_user_refunds


class RefundListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        refunds = get_user_refunds(request.user)
        serializer = RefundSerializer(refunds, many=True)
        return Response({"success": True, "data": serializer.data})
