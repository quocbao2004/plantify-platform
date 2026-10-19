from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.orders.serializers.order_read import OrderReadSerializer
from apps.orders.serializers.order_write import OrderCancelSerializer
from apps.orders.selectors.orders import get_user_orders, get_order_by_id
from apps.orders.services.cancel_order import cancel_pending_order
from apps.orders.permissions.orders import IsOwnerOfOrder
from apps.common.exceptions import ConflictError


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = get_user_orders(request.user)
        serializer = OrderReadSerializer(orders, many=True)
        return Response({"success": True, "data": serializer.data})


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOfOrder]

    def get(self, request, id):
        order = get_order_by_id(str(id), user=request.user)
        if not order:
            raise ConflictError("Không tìm thấy đơn hàng.")
        self.check_object_permissions(request, order)
        return Response({"success": True, "data": OrderReadSerializer(order).data})


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOfOrder]

    def post(self, request, id):
        order = get_order_by_id(str(id), user=request.user)
        if not order:
            raise ConflictError("Không tìm thấy đơn hàng.")
        self.check_object_permissions(request, order)

        serializer = OrderCancelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cancelled = cancel_pending_order(order, reason=serializer.validated_data.get("reason", ""))
        return Response({"success": True, "data": OrderReadSerializer(cancelled).data})
