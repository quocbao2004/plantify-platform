from django.db import transaction
from apps.accounts.models import User
from apps.system_settings.models.setting import SystemSetting
from apps.system_settings.models.audit_log import AuditLog
from apps.system_settings.constants.choices import AuditAction


@transaction.atomic
def set_system_setting(key: str, value: dict, user: User = None) -> SystemSetting:
    setting, created = SystemSetting.objects.get_or_create(key=key, defaults={"value": value, "updated_by": user})
    if not created:
        setting.value = value
        setting.updated_by = user
        setting.save(update_fields=["value", "updated_by", "updated_at"])

    AuditLog.objects.create(
        actor=user,
        action=AuditAction.CREATE if created else AuditAction.UPDATE,
        entity_type="SystemSetting",
        entity_id=setting.id,
        metadata={"key": key, "value": value},
    )
    return setting
