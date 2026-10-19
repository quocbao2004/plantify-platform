from django.urls import path
from apps.notifications.views.notifications import (
    NotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

app_name = "notifications"

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<uuid:id>/read/", MarkNotificationReadView.as_view(), name="notification-mark-read"),
    path("read-all/", MarkAllNotificationsReadView.as_view(), name="notification-read-all"),
]
