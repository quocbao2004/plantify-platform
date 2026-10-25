from django.utils import timezone
from apps.accounts.models import User
from apps.notifications.models.notification import Notification
from apps.notifications.constants.choices import NotificationType


def send_user_notification(
    user: User,
    *,
    notification_type: str = NotificationType.SYSTEM,
    title: str,
    body: str,
    payload: dict = None,
) -> Notification:
    return Notification.objects.create(
        user=user,
        type=notification_type,
        title=title,
        body=body,
        payload=payload or {},
    )


def mark_notification_as_read(notification: Notification) -> Notification:
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save(update_fields=["is_read", "read_at", "updated_at"])
    return notification


def mark_all_notifications_as_read(user: User):
    Notification.objects.filter(user=user, is_read=False).update(
        is_read=True,
        read_at=timezone.now(),
    )
