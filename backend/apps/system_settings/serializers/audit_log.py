from rest_framework import serializers
from apps.system_settings.models.audit_log import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True)
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "actor_email",
            "action",
            "action_display",
            "entity_type",
            "entity_id",
            "metadata",
            "occurred_at",
        ]
