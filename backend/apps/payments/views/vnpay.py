from urllib.parse import urlencode

from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import PurchaseOrder
from apps.payments.services.vnpay import payment_url, process_ipn, purchase_payment, valid_callback
from config.exceptions import ConflictError

IPN_MESSAGES = {
    "00": "Confirm Success",
    "01": "Order not found",
    "02": "Order already confirmed",
    "04": "Invalid amount",
    "97": "Invalid signature",
    "99": "Unknown error",
}


def callback_params(query_params):
    fields = [(key, values) for key, values in query_params.lists() if key.startswith("vnp_")]
    if any(len(values) != 1 for _, values in fields):
        return {}
    return {key: values[0] for key, values in fields}


class VNPayIPNView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        code = process_ipn(callback_params(request.query_params))
        return Response({"RspCode": code, "Message": IPN_MESSAGES[code]})


class VNPayReturnView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        if not settings.VNPAY_ORDERS_URL:
            raise ConflictError("Chưa cấu hình trang kết quả VNPay.")
        payload = callback_params(request.query_params)
        if valid_callback(payload):
            params = {"payment_ref": payload.get("vnp_TxnRef", "")}
        else:
            params = {"payment_error": "invalid"}
        separator = "&" if "?" in settings.VNPAY_ORDERS_URL else "?"
        return HttpResponseRedirect(f"{settings.VNPAY_ORDERS_URL}{separator}{urlencode(params)}")


class VNPayResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(PurchaseOrder, pk=order_id, user=request.user, checkout_key__isnull=False)
        url = payment_url(purchase_payment(order), request.META.get("REMOTE_ADDR", "127.0.0.1"))
        if not url:
            raise ConflictError("Phiên thanh toán VNPay đã hết hạn hoặc đã được xử lý.")
        return Response({"payment_url": url})
