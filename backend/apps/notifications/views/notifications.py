from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.notifications.models.notification import Notification
from apps.notifications.serializers.notification import NotificationSerializer
from apps.notifications.selectors.notifications import get_user_notifications, get_unread_notifications_count
from apps.notifications.services.create_notification import mark_notification_as_read, mark_all_notifications_as_read
from apps.common.exceptions import ConflictError


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = get_user_notifications(request.user)
        unread_count = get_unread_notifications_count(request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(
            {
                "success": True,
                "unread_count": unread_count,
                "data": serializer.data,
            }
        )


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            notification = Notification.objects.get(id=id, user=request.user)
        except Notification.DoesNotExist:
            raise ConflictError("Thông báo không tồn tại.")

        mark_notification_as_read(notification)
        return Response({"success": True, "data": NotificationSerializer(notification).data})


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        mark_all_notifications_as_read(request.user)
        return Response({"success": True, "message": "Đã đánh dấu tất cả thông báo là đã đọc."})
