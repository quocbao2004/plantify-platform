from rest_framework import serializers
from apps.recommendations.models.activity_event import UserActivityEvent


class UserActivityEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityEvent
        fields = [
            "id",
            "anonymous_session_id",
            "product",
            "event_type",
            "search_query",
            "occurred_at",
        ]
        read_only_fields = ["id", "occurred_at"]
