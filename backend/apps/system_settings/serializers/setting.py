from rest_framework import serializers
from apps.system_settings.models.setting import SystemSetting


class SystemSettingSerializer(serializers.ModelSerializer):
    updated_by_email = serializers.CharField(source="updated_by.email", read_only=True)

    class Meta:
        model = SystemSetting
        fields = ["id", "key", "value", "description", "updated_by_email", "updated_at"]
        read_only_fields = ["id", "key", "updated_by_email", "updated_at"]
