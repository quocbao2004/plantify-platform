from django.db.models import QuerySet
from apps.accounts.models import User
from apps.notifications.models.notification import Notification


def get_user_notifications(user: User) -> QuerySet[Notification]:
    return Notification.objects.filter(user=user).order_by("-created_at")


def get_unread_notifications_count(user: User) -> int:
    return Notification.objects.filter(user=user, is_read=False).count()
