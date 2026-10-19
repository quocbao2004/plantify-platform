from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.rentals.serializers.contract_read import RentalContractReadSerializer
from apps.rentals.serializers.contract_write import AllocateAssetSerializer
from apps.rentals.selectors.contracts import get_user_rental_contracts, get_rental_contract_by_id
from apps.rentals.services.allocate_asset import allocate_physical_asset
from apps.rentals.models.contract import RentalContractItem
from apps.rentals.permissions.contracts import IsOwnerOfRentalContract
from apps.common.permissions.is_staff import IsStaffUser
from apps.common.exceptions import ConflictError


class RentalContractListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contracts = get_user_rental_contracts(request.user)
        serializer = RentalContractReadSerializer(contracts, many=True)
        return Response({"success": True, "data": serializer.data})


class RentalContractDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOfRentalContract]

    def get(self, request, id):
        contract = get_rental_contract_by_id(str(id), user=request.user)
        if not contract:
            raise ConflictError("Không tìm thấy hợp đồng thuê.")
        self.check_object_permissions(request, contract)
        return Response({"success": True, "data": RentalContractReadSerializer(contract).data})


class AllocateAssetView(APIView):
    permission_classes = [IsStaffUser]

    def post(self, request, item_id):
        try:
            item = RentalContractItem.objects.get(id=item_id)
        except RentalContractItem.DoesNotExist:
            raise ConflictError("Mục hợp đồng thuê không tồn tại.")

        serializer = AllocateAssetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        allocated = allocate_physical_asset(item, serializer.validated_data["plant_asset_id"])
        return Response({"success": True, "message": "Gán cây vật lý thành công."})
