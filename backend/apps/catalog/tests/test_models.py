import pytest
from apps.catalog.models.category import Category
from apps.catalog.models.product import Product
from apps.catalog.models.variant import ProductVariant


@pytest.mark.django_db
def test_create_product_and_variant():
    cat = Category.objects.create(name="Cây văn phòng")
    prod = Product.objects.create(category=cat, name="Cây Kim Tiền")
    var = ProductVariant.objects.create(
        product=prod,
        sku="KT-M-01",
        sale_price_vnd=250000,
        deposit_vnd=300000,
    )
    assert prod.slug == "cay-kim-tien"
    assert var.sale_price_vnd == 250000
    assert var.can_sell is True
