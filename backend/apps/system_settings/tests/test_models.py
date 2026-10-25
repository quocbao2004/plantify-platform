import pytest
from apps.system_settings.models.setting import SystemSetting
from apps.system_settings.models.audit_log import AuditLog
from apps.system_settings.constants.choices import AuditAction
from apps.system_settings.services.update_setting import set_system_setting


@pytest.mark.django_db
class TestSystemSettings:
    def test_create_and_get_setting(self):
        setting = set_system_setting(key="SHIPPING_FEE_DEFAULT", value={"amount": 30000})
        assert setting.key == "SHIPPING_FEE_DEFAULT"
        assert setting.value["amount"] == 30000

        # Kiểm tra AuditLog được tạo tự động
        audit = AuditLog.objects.filter(entity_id=setting.id).first()
        assert audit is not None
        assert audit.action == AuditAction.CREATE
        assert audit.metadata["key"] == "SHIPPING_FEE_DEFAULT"
