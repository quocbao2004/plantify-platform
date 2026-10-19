from rest_framework import serializers
from apps.notifications.models.notification import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "type",
            "type_display",
            "title",
            "body",
            "payload",
            "is_read",
            "read_at",
            "created_at",
        ]
        read_only_fields = ["id", "type", "type_display", "title", "body", "payload", "created_at"]
