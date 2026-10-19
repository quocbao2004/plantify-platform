from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.payments.models.payment import Payment
from apps.payments.models.payment_attempt import PaymentAttempt
from apps.payments.services.capture_payment import capture_successful_payment
from apps.payments.services.verify_webhook import verify_gateway_webhook


class PaymentWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, provider):
        # 1. Log attempt
        signature = request.headers.get("X-Signature", "")
        payload = request.data

        is_valid = verify_gateway_webhook(provider, payload, signature)
        if not is_valid:
            return Response({"success": False, "message": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        order_code = payload.get("order_code")
        payment = Payment.objects.filter(order__order_code=order_code).first()
        if payment:
            PaymentAttempt.objects.create(
                payment=payment,
                provider=provider,
                provider_transaction_id=payload.get("transaction_id"),
                status="SUCCESS",
                provider_response=payload,
            )
            capture_successful_payment(payment)

        return Response({"success": True, "message": "Webhook processed idempotently"})
