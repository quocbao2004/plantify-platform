from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.catalog.models import Category, Media, Plants, PlantsDetail
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail


class HomeCatalogTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.indoor = Category.objects.create(name="Cây trong nhà", sort_order=1)
        cls.desktop = Category.objects.create(name="Cây để bàn", sort_order=2)
        cls.plant = Plants.objects.create(category=cls.desktop, name="Kim tiền", care_level="EASY")
        cls.variant = PlantsDetail.objects.create(plant=cls.plant, sku="KT-M", sale_price=299000)
        Media.objects.create(plant_detail=cls.variant, file_url="https://example.com/kim-tien.webp", is_primary=True)
        cls.other = Plants.objects.create(category=cls.indoor, name="Bàng Singapore")
        hidden_category = Category.objects.create(name="Danh mục ẩn", is_active=False)
        Plants.objects.create(category=hidden_category, name="Cây từ danh mục ẩn")
        Plants.objects.create(category=cls.indoor, name="Cây ẩn", is_active=False)

    def setUp(self):
        self.client = APIClient()
        self.plants_url = reverse("api_v1:catalog:plants-list")

    def test_filters_catalog_by_category_before_pagination(self):
        for category in (self.desktop.id, self.desktop.slug, self.desktop.name):
            response = self.client.get(self.plants_url, {"category": category, "page_size": 1})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["pagination"]["count"], 1)
            self.assertEqual(response.data["data"][0]["slug"], self.plant.slug)

        response = self.client.get(self.plants_url, {"care_level": "EASY"})
        self.assertEqual([item["slug"] for item in response.data["data"]], [self.plant.slug])

    def test_popularity_counts_purchases_and_excludes_cancelled_orders(self):
        user = get_user_model().objects.create_user(email="buyer@example.com")
        other_variant = PlantsDetail.objects.create(plant=self.other, sku="BS-M", sale_price=549000)
        for status, variant, quantity in (
            (PurchaseOrder.OrderStatus.COMPLETED, self.variant, 2),
            (PurchaseOrder.OrderStatus.CANCELLED, other_variant, 5),
        ):
            order = PurchaseOrder.objects.create(user=user, order_code=status, status=status)
            PurchaseOrderDetail.objects.create(
                purchase_order=order, plant_detail=variant, quantity=quantity, unit_price=variant.sale_price,
            )

        response = self.client.get(self.plants_url, {"sort_by": "popular"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [(item["slug"], item["units_sold"]) for item in response.data["data"]],
            [(self.plant.slug, 2), (self.other.slug, 0)],
        )

    def test_opens_plant_details_by_slug_and_uuid(self):
        slug_url = reverse("api_v1:catalog:plants-by-slug", args=[self.plant.slug])
        uuid_url = reverse("api_v1:catalog:plants-detail", args=[self.plant.id])
        for url in (slug_url, uuid_url):
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)
            detail = response.data["details"][0]
            self.assertEqual(detail["sale_price"], "299000.00")
            self.assertEqual(detail["media"][0]["file_url"], "https://example.com/kim-tien.webp")
