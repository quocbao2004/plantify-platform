import pytest
from apps.accounts.models import User
from apps.orders.models.order import Order
from apps.rentals.models.contract import RentalContract
from apps.rentals.constants.choices import RentalContractStatus


@pytest.mark.django_db
def test_create_rental_contract():
    user = User.objects.create_user(email="renter@plantify.vn", password="Password123!", full_name="Renter")
    order = Order.objects.create(user=user, order_code="ORD-RENT-001", payable_total_vnd=500000)
    contract = RentalContract.objects.create(
        order=order,
        user=user,
        contract_code="HDT-001",
        deposit_total_vnd=300000,
    )
    assert contract.status == RentalContractStatus.PENDING_DELIVERY
    assert contract.deposit_total_vnd == 300000
