from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, override_settings

from apps.accounts.models import User
from apps.catalog.models import Category, Product, ProductImage, ProductVariant, RentalRate
from apps.cms.models import Banner
from apps.inventory.models import PlantAsset, StockBalance, StockMovement
from apps.loyalty.models import LoyaltyTier


class DemoSeedTests(TestCase):
    def setUp(self):
        self.media = TemporaryDirectory(prefix="seed-test-", dir=settings.BASE_DIR)
        self.addCleanup(self.media.cleanup)
        self.settings_override = override_settings(MEDIA_ROOT=self.media.name)
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)

    def seed(self, **kwargs):
        output = StringIO()
        call_command("seed_demo_data", stdout=output, **kwargs)
        return output.getvalue()

    def test_repeat_seed_preserves_inventory_prices_and_ids(self):
        self.assertIn("41 new records", self.seed())
        models = (Category, Product, ProductVariant, ProductImage, RentalRate,
                  StockBalance, StockMovement, PlantAsset, LoyaltyTier, Banner)
        original_ids = {model: set(model.objects.values_list("pk", flat=True)) for model in models}
        variant = ProductVariant.objects.get(sku="KB-MONSTERA-M")
        variant.sale_price_vnd = 450000
        variant.save()
        balance = variant.stock_balance
        balance.quantity_on_hand = 7
        balance.quantity_reserved = 2
        balance.save()

        self.assertIn("0 new records", self.seed())
        for model, ids in original_ids.items():
            self.assertEqual(set(model.objects.values_list("pk", flat=True)), ids)
        variant.refresh_from_db()
        balance.refresh_from_db()
        self.assertEqual(variant.sale_price_vnd, 450000)
        self.assertEqual((balance.quantity_on_hand, balance.quantity_reserved), (7, 2))
        self.assertFalse(User.objects.exists())
        for image in ProductImage.objects.all():
            self.assertTrue(image.image.storage.exists(image.image.name))
        response = self.client.get("/api/v1/catalog/products/", HTTP_HOST="localhost")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["pagination"]["count"], 4)
        self.assertTrue(all(item["primary_image"] for item in response.json()["data"]))

    def test_missing_assets_do_not_write_database_records(self):
        with self.assertRaisesMessage(CommandError, "Missing seed images"):
            self.seed(assets_dir=Path(self.media.name) / "missing")
        self.assertFalse(Category.objects.exists())

    def test_sku_collision_rolls_back_new_catalog_records(self):
        category = Category.objects.create(name="Existing", slug="existing")
        product = Product.objects.create(name="Existing plant", slug="existing-plant", category=category)
        ProductVariant.objects.create(product=product, sku="KB-MONSTERA-M")
        with self.assertRaisesMessage(CommandError, "already belongs to another product"):
            self.seed()
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Product.objects.count(), 1)
        self.assertFalse(StockBalance.objects.exists())
