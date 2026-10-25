import pytest
from apps.accounts.models import User
from apps.orders.models.order import Order
from apps.orders.utils.totals import calculate_order_payable_total


@pytest.mark.django_db
def test_order_creation_and_totals():
    user = User.objects.create_user(email="order_test@plantify.vn", password="Password123!", full_name="Tester")
    payable = calculate_order_payable_total(
        subtotal_sale_vnd=500000,
        subtotal_rent_vnd=200000,
        deposit_total_vnd=300000,
        shipping_fee_vnd=30000,
        discount_total_vnd=50000,
    )
    assert payable == 980000

    order = Order.objects.create(
        user=user,
        order_code="ORD-TEST-001",
        payable_total_vnd=payable,
    )
    assert order.payable_total_vnd == 980000
