from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.orders.serializers.checkout import CheckoutSerializer
from apps.orders.serializers.order_read import OrderReadSerializer
from apps.orders.services.checkout_order import checkout_cart_order


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = checkout_cart_order(
            user=request.user,
            shipping_address=serializer.validated_data["shipping_address"],
            payment_method=serializer.validated_data.get("payment_method", "COD"),
            note=serializer.validated_data.get("note", ""),
        )

        return Response(
            {
                "success": True,
                "message": "Tạo đơn hàng thành công.",
                "data": OrderReadSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )
