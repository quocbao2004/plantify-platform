import pytest
from apps.accounts.models import User
from apps.notifications.models.notification import Notification
from apps.notifications.constants.choices import NotificationType


@pytest.mark.django_db
def test_create_notification():
    user = User.objects.create_user(email="notify_user@plantify.vn", password="Password123!", full_name="User")
    notif = Notification.objects.create(
        user=user,
        type=NotificationType.ORDER,
        title="Đơn hàng đã được xác nhận",
        body="Đơn hàng của bạn đang được đóng gói.",
    )
    assert notif.is_read is False
    assert notif.type == NotificationType.ORDER
