from django.contrib import admin
from apps.system_settings.models.setting import SystemSetting
from apps.system_settings.models.audit_log import AuditLog


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ["key", "updated_by", "updated_at"]
    search_fields = ["key", "description"]
    readonly_fields = ["updated_at"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "actor", "entity_type", "entity_id", "occurred_at"]
    list_filter = ["action", "entity_type"]
    search_fields = ["entity_type", "entity_id", "actor__email"]
    readonly_fields = ["id", "actor", "action", "entity_type", "entity_id", "metadata", "occurred_at"]
