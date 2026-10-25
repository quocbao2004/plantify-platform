from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.rentals.models.contract import RentalContractItem
from apps.rentals.serializers.extension import RentalExtensionSerializer
from apps.rentals.services.extend_rental import request_rental_extension
from apps.common.exceptions import ConflictError


class RentalExtensionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        try:
            item = RentalContractItem.objects.get(id=item_id, contract__user=request.user)
        except RentalContractItem.DoesNotExist:
            raise ConflictError("Mục hợp đồng thuê không tồn tại.")

        requested_end_at = request.data.get("requested_end_at")
        reason = request.data.get("reason", "")
        additional_fee = int(request.data.get("additional_fee_vnd", 0))

        ext = request_rental_extension(
            item,
            requested_end_at=requested_end_at,
            reason=reason,
            additional_fee_vnd=additional_fee,
        )
        return Response({"success": True, "data": RentalExtensionSerializer(ext).data}, status=status.HTTP_201_CREATED)
