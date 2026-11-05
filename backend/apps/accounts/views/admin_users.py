from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from apps.accounts.models import User
from apps.accounts.serializers.user import UserSerializer
from apps.system_settings.permissions.settings import IsAdminOnly


class AdminUserListView(generics.ListAPIView):
    """
    Admin-only endpoint to list and search customer/user accounts.
    Supports filtering by search query (name, email, phone), role, and active status.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAdminOnly]

    def get_queryset(self):
        queryset = User.objects.all().order_by("-date_joined")

        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
            )

        role = self.request.query_params.get("role", "").strip()
        if role:
            queryset = queryset.filter(role=role)

        is_active = self.request.query_params.get("is_active", "").strip()
        if is_active.lower() in ("true", "1"):
            queryset = queryset.filter(is_active=True)
        elif is_active.lower() in ("false", "0"):
            queryset = queryset.filter(is_active=False)

        return queryset


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    Admin-only endpoint to view and update user account details (e.g. status, role).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOnly]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        # Cho phép admin cập nhật trạng thái hoạt động hoặc vai trò
        allowed_fields = ["is_active", "role"]
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}

        for attr, value in update_data.items():
            setattr(instance, attr, value)

        instance.save()
        return Response(UserSerializer(instance).data, status=status.HTTP_200_OK)
