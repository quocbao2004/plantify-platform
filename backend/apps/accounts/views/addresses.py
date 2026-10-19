from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.models import UserAddress
from apps.accounts.serializers.address import UserAddressSerializer
from apps.accounts.selectors.addresses import get_user_addresses
from apps.accounts.services.manage_profile import create_or_update_address
from apps.accounts.permissions.profile import IsOwnerOfAddress
from apps.common.exceptions import ConflictError


class AddressListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = get_user_addresses(request.user)
        serializer = UserAddressSerializer(addresses, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        serializer = UserAddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        address = create_or_update_address(request.user, **serializer.validated_data)
        return Response({"success": True, "data": UserAddressSerializer(address).data}, status=status.HTTP_201_CREATED)


class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOfAddress]

    def patch(self, request, id):
        try:
            address = UserAddress.objects.get(id=id, user=request.user)
        except UserAddress.DoesNotExist:
            raise ConflictError("Địa chỉ không tồn tại.")

        self.check_object_permissions(request, address)
        serializer = UserAddressSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = create_or_update_address(request.user, address_id=str(id), **serializer.validated_data)
        return Response({"success": True, "data": UserAddressSerializer(updated).data})

    def delete(self, request, id):
        try:
            address = UserAddress.objects.get(id=id, user=request.user)
        except UserAddress.DoesNotExist:
            raise ConflictError("Địa chỉ không tồn tại.")

        self.check_object_permissions(request, address)
        address.delete()
        return Response({"success": True, "message": "Đã xóa địa chỉ thành công."}, status=status.HTTP_200_OK)
