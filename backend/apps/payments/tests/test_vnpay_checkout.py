import hashlib
import hmac
from datetime import timedelta
from urllib.parse import parse_qs, urlencode, urlsplit
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.catalog.models import Category, Plants, PlantsDetail
from apps.orders.models import PurchaseOrder
from apps.payments.models import Transaction
from apps.payments.services.vnpay_reconciliation import RESPONSE_FIELDS, reconcile_result

TEST_SECRET = "test-only-vnpay-secret"


def checksum(text):
    return hmac.new(TEST_SECRET.encode(), text.encode(), hashlib.sha512).hexdigest()


@override_settings(
    CHECKOUT_SHIPPING_FEE_VND=25000,
    VNPAY_TMN_CODE="TESTVN01",
    VNPAY_HASH_SECRET=TEST_SECRET,
    VNPAY_PAYMENT_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    VNPAY_RETURN_URL="https://backend.example/api/v1/payments/vnpay/return/",
    VNPAY_ORDERS_URL="https://plantify.example/orders",
)
class VnpayCheckoutTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(email="buyer@example.com")
        cls.other_user = get_user_model().objects.create_user(email="other@example.com")
        category = Category.objects.create(name="Cây để bàn")
        plant = Plants.objects.create(category=category, name="Kim tiền")
        cls.variant = PlantsDetail.objects.create(plant=plant, sku="KT-M", sale_price=299000, stock_quantity=1)

    def make_order(self):
        buyer = APIClient()
        buyer.force_authenticate(self.user)
        response = buyer.post(reverse("api_v1:orders:checkout"), {
            "items": [{"plant_detail": self.variant.pk, "quantity": 1, "unit_price": "299000.00"}],
            "checkout_key": uuid4(), "shipping_fee": "25000.00", "payment_method": "VNPAY",
            "recipient_name": "Người nhận", "recipient_phone": "0912345678", "shipping_address": "Địa chỉ thử",
        }, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        return response, Transaction.objects.get()

    def callback(self, payment, **updated):
        payload = {
            "vnp_TmnCode": "TESTVN01", "vnp_TxnRef": payment.transaction_code, "vnp_Amount": "32400000",
            "vnp_ResponseCode": "00", "vnp_TransactionStatus": "00", "vnp_OrderInfo": "Thanh toan don hang",
            **updated,
        }
        payload["vnp_SecureHash"] = checksum(urlencode(sorted(payload.items())))
        return payload

    def ipn(self, payload):
        return self.client.get(reverse("api_v1:payments:vnpay-ipn"), payload).json()["RspCode"]

    @override_settings(VNPAY_PAYMENT_URL="")
    def test_quote_disables_vnpay_without_gateway_url(self):
        response = self.client.post(reverse("api_v1:orders:cart-quote"), {
            "items": [{"plant_detail": self.variant.pk, "quantity": 1}],
        }, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["vnpay_enabled"])

    def test_checkout_signs_amount_and_reserves_stock_before_redirect(self):
        response, payment = self.make_order()
        url = urlsplit(response.data["payment_url"])
        query, signature = url.query.rsplit("&vnp_SecureHash=", 1)
        self.assertEqual(signature, checksum(query))
        self.assertEqual(parse_qs(query)["vnp_Amount"], ["32400000"])
        self.assertEqual(parse_qs(query)["vnp_TxnRef"], [payment.transaction_code])
        self.assertEqual(payment.status, Transaction.TransactionStatus.PENDING)
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 0)

    def test_return_only_redirects_ipn_marks_paid_once(self):
        _, payment = self.make_order()
        payload = self.callback(payment)
        returned = self.client.get(reverse("api_v1:payments:vnpay-return"), payload)
        self.assertEqual(returned.url, "https://plantify.example/orders?payment_ref=" + payment.transaction_code)
        self.assertEqual(PurchaseOrder.objects.get().status, PurchaseOrder.OrderStatus.PENDING)
        self.assertEqual(self.ipn(payload), "00")
        self.assertEqual(self.ipn(payload), "02")
        self.assertEqual(PurchaseOrder.objects.get().status, PurchaseOrder.OrderStatus.PAID)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Transaction.TransactionStatus.SUCCESS)

    def test_rejects_invalid_signature_merchant_and_amount(self):
        _, payment = self.make_order()
        forged = {**self.callback(payment), "vnp_SecureHash": "bad"}
        self.assertEqual(self.ipn(forged), "97")
        self.assertEqual(self.ipn(self.callback(payment, vnp_TmnCode="BADMERCH")), "97")
        self.assertEqual(self.ipn(self.callback(payment, vnp_Amount="1")), "04")
        self.assertEqual(PurchaseOrder.objects.get().status, PurchaseOrder.OrderStatus.PENDING)

    def test_cancelled_payment_restores_stock_and_duplicate_ipn_does_not_repeat_it(self):
        _, payment = self.make_order()
        payload = self.callback(payment, vnp_ResponseCode="24", vnp_TransactionStatus="02")
        self.assertEqual(self.ipn(payload), "00")
        self.assertEqual(self.ipn(payload), "02")
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 1)
        self.assertEqual(PurchaseOrder.objects.get().status, PurchaseOrder.OrderStatus.CANCELLED)

    def test_only_owner_can_resume_an_unexpired_transaction(self):
        _, payment = self.make_order()
        url = reverse("api_v1:payments:vnpay-resume", args=[payment.purchase_order_id])
        api_client = APIClient()
        api_client.force_authenticate(self.other_user)
        self.assertEqual(api_client.post(url).status_code, 404)
        api_client.force_authenticate(self.user)
        self.assertEqual(api_client.post(url).status_code, 200)
        Transaction.objects.filter(pk=payment.pk).update(transaction_date=timezone.now() - timedelta(minutes=20))
        self.assertEqual(api_client.post(url).status_code, 409)

    def test_signed_no_transaction_response_releases_only_expired_stock(self):
        _, payment = self.make_order()
        data = {
            "vnp_Command": "querydr", "vnp_TmnCode": "TESTVN01", "vnp_TxnRef": payment.transaction_code,
            "vnp_ResponseCode": "91",
        }
        data["vnp_SecureHash"] = checksum("|".join(data.get(field, "") for field in RESPONSE_FIELDS))
        self.assertEqual(reconcile_result(payment, data), "99")
        payment.transaction_date = timezone.now() - timedelta(minutes=20)
        payment.save(update_fields=["transaction_date"])
        self.assertEqual(reconcile_result(payment, data), "00")
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 1)
