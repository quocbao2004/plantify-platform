import pytest
from apps.catalog.models.category import Category
from apps.catalog.models.product import Product
from apps.catalog.models.variant import ProductVariant
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.models.plant_asset import PlantAsset
from apps.inventory.constants.choices import PlantAssetStatus


@pytest.mark.django_db
def test_stock_balance_available_math():
    cat = Category.objects.create(name="Cây")
    prod = Product.objects.create(category=cat, name="Lan Ý")
    var = ProductVariant.objects.create(product=prod, sku="LY-01")
    balance = StockBalance.objects.create(variant=var, quantity_on_hand=10, quantity_reserved=3)
    assert balance.available_for_sale == 7


@pytest.mark.django_db
def test_create_plant_asset():
    cat = Category.objects.create(name="Cây")
    prod = Product.objects.create(category=cat, name="Bàng Indo")
    var = ProductVariant.objects.create(product=prod, sku="BI-01")
    asset = PlantAsset.objects.create(variant=var, asset_code="ASSET-BI-001")
    assert asset.status == PlantAssetStatus.AVAILABLE
