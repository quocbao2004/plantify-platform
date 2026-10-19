from rest_framework import generics
from apps.system_settings.models.audit_log import AuditLog
from apps.system_settings.serializers.audit_log import AuditLogSerializer
from apps.system_settings.permissions.settings import IsAdminOnly


class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.select_related("actor").order_by("-occurred_at")
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOnly]
