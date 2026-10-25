from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.orders.serializers.cart import CartSerializer, CartItemSerializer
from apps.orders.selectors.carts import get_user_cart
from apps.orders.services.add_to_cart import add_item_to_cart
from apps.orders.models.cart import CartItem
from apps.common.exceptions import ConflictError


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_user_cart(request.user)
        return Response({"success": True, "data": CartSerializer(cart).data})

    def post(self, request):
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = add_item_to_cart(
            user=request.user,
            variant_id=serializer.validated_data["variant_id"],
            item_type=serializer.validated_data.get("item_type", "SALE"),
            quantity=serializer.validated_data.get("quantity", 1),
            rental_start_at=serializer.validated_data.get("rental_start_at"),
            rental_end_at=serializer.validated_data.get("rental_end_at"),
        )
        return Response({"success": True, "data": CartItemSerializer(item).data}, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            item = CartItem.objects.get(id=id, cart__user=request.user)
        except CartItem.DoesNotExist:
            raise ConflictError("Mục giỏ hàng không tồn tại.")

        qty = int(request.data.get("quantity", item.quantity))
        if qty <= 0:
            item.delete()
            return Response({"success": True, "message": "Đã xóa khỏi giỏ hàng."})

        item.quantity = qty
        item.save(update_fields=["quantity", "updated_at"])
        return Response({"success": True, "data": CartItemSerializer(item).data})

    def delete(self, request, id):
        CartItem.objects.filter(id=id, cart__user=request.user).delete()
        return Response({"success": True, "message": "Đã xóa khỏi giỏ hàng."})
