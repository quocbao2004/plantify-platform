from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.serializers.stock import StockBalanceSerializer
from apps.inventory.services.receive_stock import receive_new_stock
from apps.inventory.permissions.inventory import IsStaffForInventory


class StockBalanceListView(generics.ListAPIView):
    permission_classes = [IsStaffForInventory]
    serializer_class = StockBalanceSerializer
    queryset = StockBalance.objects.select_related("variant__product").order_by("-updated_at")


class StockAdjustmentView(APIView):
    permission_classes = [IsStaffForInventory]

    def post(self, request):
        variant_id = request.data.get("variant_id")
        quantity = int(request.data.get("quantity", 0))
        note = request.data.get("note", "")
        balance = receive_new_stock(variant_id, quantity, note=note, performed_by=request.user)
        return Response({"success": True, "data": StockBalanceSerializer(balance).data}, status=status.HTTP_200_OK)
