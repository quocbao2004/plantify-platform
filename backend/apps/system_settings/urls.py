from django.urls import path
from apps.system_settings.views.settings import SystemSettingListView, SystemSettingDetailView
from apps.system_settings.views.audit_logs import AuditLogListView

app_name = "system_settings"

urlpatterns = [
    path("admin/settings/", SystemSettingListView.as_view(), name="setting-list"),
    path("admin/settings/<str:key>/", SystemSettingDetailView.as_view(), name="setting-detail"),
    path("admin/audit-logs/", AuditLogListView.as_view(), name="audit-log-list"),
]
