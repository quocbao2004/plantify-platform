from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.orders.models.order import Order
from apps.payments.serializers.payment import PaymentSerializer
from apps.payments.selectors.payments import get_user_payments
from apps.payments.services.create_payment import create_order_payment
from apps.payments.services.capture_payment import capture_successful_payment
from apps.payments.models.payment import Payment
from apps.payments.permissions.payments import IsOwnerOfPayment
from apps.common.exceptions import ConflictError


class PaymentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = get_user_payments(request.user)
        serializer = PaymentSerializer(payments, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        order_id = request.data.get("order_id")
        method = request.data.get("method", "COD")
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            raise ConflictError("Không tìm thấy đơn hàng.")

        payment = create_order_payment(order, method=method)
        return Response({"success": True, "data": PaymentSerializer(payment).data}, status=status.HTTP_201_CREATED)


class PaymentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOfPayment]

    def get(self, request, id):
        try:
            payment = Payment.objects.prefetch_related("allocations").get(id=id)
        except Payment.DoesNotExist:
            raise ConflictError("Không tìm thấy khoản thanh toán.")
        self.check_object_permissions(request, payment)
        return Response({"success": True, "data": PaymentSerializer(payment).data})
