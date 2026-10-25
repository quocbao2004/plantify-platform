from rest_framework import generics, status
from rest_framework.response import Response
from apps.system_settings.models.setting import SystemSetting
from apps.system_settings.serializers.setting import SystemSettingSerializer
from apps.system_settings.permissions.settings import IsAdminOnly
from apps.system_settings.services.update_setting import set_system_setting


class SystemSettingListView(generics.ListCreateAPIView):
    queryset = SystemSetting.objects.select_related("updated_by").order_by("key")
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAdminOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        key = serializer.validated_data["key"]
        value = serializer.validated_data["value"]
        setting = set_system_setting(key=key, value=value, user=request.user)
        return Response(SystemSettingSerializer(setting).data, status=status.HTTP_201_CREATED)


class SystemSettingDetailView(generics.RetrieveUpdateAPIView):
    queryset = SystemSetting.objects.select_related("updated_by")
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAdminOnly]
    lookup_field = "key"

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        value = serializer.validated_data.get("value", instance.value)
        setting = set_system_setting(key=instance.key, value=value, user=request.user)
        return Response(SystemSettingSerializer(setting).data)
