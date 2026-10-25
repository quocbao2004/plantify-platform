import pytest
from apps.accounts.models import User
from apps.orders.models.order import Order
from apps.payments.models.payment import Payment
from apps.payments.constants.choices import PaymentMethod, PaymentStatus


@pytest.mark.django_db
def test_create_payment_with_idempotency():
    user = User.objects.create_user(email="pay_tester@plantify.vn", password="Password123!", full_name="Pay Tester")
    order = Order.objects.create(user=user, order_code="ORD-PAY-001", payable_total_vnd=350000)
    payment = Payment.objects.create(
        order=order,
        amount_vnd=350000,
        method=PaymentMethod.VNPAY,
        idempotency_key="PAY-ORD-PAY-001",
    )
    assert payment.status == PaymentStatus.PENDING
    assert payment.amount_vnd == 350000
