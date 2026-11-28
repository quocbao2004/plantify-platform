from django.db.models import prefetch_related_objects
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from apps.orders.serializers.checkout import CartQuoteSerializer, CheckoutSerializer
from apps.orders.serializers.purchase_order import PurchaseOrderSerializer
from apps.orders.services.checkout import place_order, quote_cart
from apps.payments.services.vnpay import payment_url, purchase_payment


class CartQuoteView(generics.GenericAPIView):
    serializer_class = CartQuoteSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(quote_cart(serializer.validated_data["items"]))


class CheckoutView(generics.GenericAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        checkout = dict(serializer.validated_data)
        checkout["shipping_fee_confirmed"] = checkout.pop("shipping_fee")
        order, created = place_order(request.user, **checkout)
        prefetch_related_objects([order], "details__plant_detail__plant", "details__plant_detail__media", "transactions")
        data = PurchaseOrderSerializer(order).data
        url = payment_url(purchase_payment(order), request.META.get("REMOTE_ADDR", "127.0.0.1"))
        if url:
            data["payment_url"] = url
        return Response(
            data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
