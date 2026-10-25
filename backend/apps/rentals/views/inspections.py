from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.rentals.models.contract import RentalContractItem
from apps.rentals.serializers.inspection import RentalInspectionSerializer
from apps.rentals.services.return_asset import process_rental_return
from apps.common.permissions.is_staff import IsStaffUser
from apps.common.exceptions import ConflictError


class RentalInspectionCreateView(APIView):
    permission_classes = [IsStaffUser]

    def post(self, request, item_id):
        try:
            item = RentalContractItem.objects.get(id=item_id)
        except RentalContractItem.DoesNotExist:
            raise ConflictError("Mục hợp đồng không tồn tại.")

        condition = request.data.get("condition")
        damage_fee = int(request.data.get("damage_fee_vnd", 0))
        notes = request.data.get("notes", "")

        inspection = process_rental_return(
            item,
            inspector=request.user,
            condition=condition,
            damage_fee_vnd=damage_fee,
            notes=notes,
        )
        return Response({"success": True, "data": RentalInspectionSerializer(inspection).data}, status=status.HTTP_201_CREATED)
