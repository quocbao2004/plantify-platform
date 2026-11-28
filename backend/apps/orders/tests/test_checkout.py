from decimal import Decimal
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from apps.catalog.models import Category, Plants, PlantsDetail
from apps.orders.models import PurchaseOrder
from apps.orders.services.checkout import update_order_status
from apps.payments.models import Transaction


@override_settings(CHECKOUT_SHIPPING_FEE_VND=25000)
class CheckoutTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.buyer = get_user_model().objects.create_user(
            email="buyer@example.com", full_name="Khách thử", phone="0912345678",
        )
        cls.other_buyer = get_user_model().objects.create_user(email="other@example.com")
        category = Category.objects.create(name="Cây để bàn")
        plant = Plants.objects.create(category=category, name="Kim tiền")
        cls.variant = PlantsDetail.objects.create(
            plant=plant, sku="KT-M", size="M", sale_price=299000, stock_quantity=3,
        )

    def setUp(self):
        self.client = APIClient()
        self.checkout_url = reverse("api_v1:orders:checkout")
        self.payload = {
            "items": [{"plant_detail": str(self.variant.pk), "quantity": 2, "unit_price": "299000.00"}],
            "checkout_key": str(uuid4()),
            "shipping_fee": "25000.00",
            "recipient_name": "Người nhận khác",
            "recipient_phone": "0912345678",
            "shipping_address": "Địa chỉ thử",
        }

    def place_order(self):
        self.client.force_authenticate(self.buyer)
        response = self.client.post(self.checkout_url, self.payload, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        return response

    def test_guest_can_quote_but_cannot_place_order(self):
        response = self.client.post(
            reverse("api_v1:orders:cart-quote"), {"items": self.payload["items"]}, format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total"], "623000.00")
        self.assertEqual(response.data["items"][0]["available_quantity"], 3)
        self.assertEqual(self.client.post(self.checkout_url, self.payload, format="json").status_code, 401)

    def test_order_snapshots_delivery_and_retry_does_not_decrement_stock_again(self):
        created = self.place_order()
        retry = self.client.post(self.checkout_url, self.payload, format="json")
        self.assertEqual(retry.status_code, 200)
        self.assertEqual(retry.data["id"], created.data["id"])
        order = PurchaseOrder.objects.get()
        self.assertEqual(order.recipient_name, "Người nhận khác")
        self.assertEqual(order.total_amount, Decimal("623000.00"))
        self.assertEqual(order.details.get().unit_price, Decimal("299000.00"))
        self.assertEqual(order.transactions.get().status, Transaction.TransactionStatus.PENDING)
        self.assertEqual(get_user_model().objects.get(pk=self.buyer.pk).full_name, "Khách thử")
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 1)

    def test_changed_price_or_insufficient_stock_does_not_create_an_order(self):
        self.client.force_authenticate(self.buyer)
        for quantity, price in ((2, "100.00"), (4, "299000.00")):
            self.payload["items"][0].update(quantity=quantity, unit_price=price)
            response = self.client.post(self.checkout_url, self.payload, format="json")
            self.assertEqual(response.status_code, 409)
        self.assertFalse(PurchaseOrder.objects.exists())
        self.assertFalse(Transaction.objects.exists())
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 3)

    def test_missing_shipping_and_duplicate_lines_are_rejected(self):
        self.client.force_authenticate(self.buyer)
        self.payload["shipping_address"] = " "
        self.payload["items"] *= 2
        response = self.client.post(self.checkout_url, self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(set(response.data["error"]["details"]), {"shipping_address", "items"})
        self.assertFalse(PurchaseOrder.objects.exists())

    def test_other_customer_cannot_read_order_or_its_lines(self):
        created = self.place_order()
        self.client.force_authenticate(self.other_buyer)
        detail_url = reverse("api_v1:orders:purchase-order-detail", args=[created.data["id"]])
        self.assertEqual(self.client.get(detail_url).status_code, 404)
        list_url = reverse("api_v1:orders:purchase-order-list")
        self.assertEqual(self.client.get(list_url, {"checkout_key": self.payload["checkout_key"]}).data["data"], [])
        line_url = reverse("api_v1:orders:purchase-order-detail-items")
        self.assertEqual(self.client.get(line_url).data["data"], [])

    def test_cancellation_restores_stock_once(self):
        self.place_order()
        order = PurchaseOrder.objects.get()
        cancelled = PurchaseOrder.OrderStatus.CANCELLED
        self.assertTrue(update_order_status(order.pk, cancelled))
        self.assertFalse(update_order_status(order.pk, cancelled))
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 3)
        self.assertEqual(order.transactions.get().status, Transaction.TransactionStatus.CANCELLED)

    def test_admin_order_status_uses_checkout_cancellation(self):
        order = self.place_order().data
        url = reverse("api_v1:orders:admin-order-detail", args=[order["id"]])
        payload = {"status": PurchaseOrder.OrderStatus.CANCELLED}
        self.assertEqual(self.client.patch(url, payload, format="json").status_code, 403)

        staff = get_user_model().objects.create_user(email="staff@example.com", is_staff=True)
        self.client.force_authenticate(staff)
        for _ in range(2):
            response = self.client.patch(url, payload, format="json")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["status"], PurchaseOrder.OrderStatus.CANCELLED)
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock_quantity, 3)

    def test_only_completed_cod_is_marked_as_collected(self):
        self.place_order()
        order = PurchaseOrder.objects.get()
        status = PurchaseOrder.OrderStatus
        self.assertFalse(update_order_status(order.pk, status.COMPLETED))
        self.assertTrue(update_order_status(order.pk, status.PROCESSING))
        self.assertTrue(update_order_status(order.pk, status.DELIVERING))
        self.assertEqual(order.transactions.get().status, Transaction.TransactionStatus.PENDING)
        self.assertTrue(update_order_status(order.pk, status.COMPLETED))
        self.assertEqual(order.transactions.get().status, Transaction.TransactionStatus.SUCCESS)
