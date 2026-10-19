from typing import Any, Optional
from apps.system_settings.models.setting import SystemSetting


def get_setting_value(key: str, default: Any = None) -> Any:
    setting = SystemSetting.objects.filter(key=key).first()
    return setting.value if setting else default
