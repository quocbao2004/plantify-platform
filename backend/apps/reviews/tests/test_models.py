import pytest
from apps.accounts.models import User
from apps.catalog.models.category import Category
from apps.catalog.models.product import Product
from apps.catalog.models.variant import ProductVariant
from apps.orders.models.order import Order
from apps.orders.models.order_item import OrderItem
from apps.reviews.models.review import ProductReview


@pytest.mark.django_db
def test_create_review():
    user = User.objects.create_user(email="reviewer@plantify.vn", password="Password123!", full_name="Reviewer")
    cat = Category.objects.create(name="Cây mini")
    prod = Product.objects.create(category=cat, name="Xương Rồng Bát Tiên")
    var = ProductVariant.objects.create(product=prod, sku="XR-01")
    order = Order.objects.create(user=user, order_code="ORD-REV-001")
    item = OrderItem.objects.create(order=order, variant=var, quantity=1, unit_price_vnd=50000, line_total_vnd=50000)

    review = ProductReview.objects.create(
        user=user,
        product=prod,
        order_item=item,
        rating=5,
        comment="Cây rất tươi và đẹp!",
    )
    assert review.rating == 5
    assert review.product.name == "Xương Rồng Bát Tiên"
