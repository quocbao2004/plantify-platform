import re
from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Q
from apps.accounts.models import User
from apps.accounts.serializers.user import UserSerializer
from apps.accounts.constants import (
    UserRole,
    PHONE_REGEX,
    PHONE_REQUIRED_ERROR,
    PHONE_INVALID_ERROR,
    PHONE_ALREADY_EXISTS_ERROR,
)
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
            if role in ("STAFF_ALL", "STAFF_GROUP"):
                queryset = queryset.filter(
                    role__in=[UserRole.STAFF, UserRole.DELIVERY, UserRole.WARRANTY, UserRole.ADMIN]
                )
            else:
                queryset = queryset.filter(role=role)

        is_active = self.request.query_params.get("is_active", "").strip()
        if is_active.lower() in ("true", "1"):
            queryset = queryset.filter(is_active=True)
        elif is_active.lower() in ("false", "0"):
            queryset = queryset.filter(is_active=False)

        return queryset


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    Admin-only endpoint to view and update user account details (status, role, name, phone).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOnly]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()

        # Update full_name if provided
        if "full_name" in request.data:
            clean_name = str(request.data["full_name"]).strip()
            if clean_name:
                instance.full_name = clean_name

        # Update phone if provided with validation against duplicate and format
        if "phone" in request.data:
            val = request.data.get("phone")
            if val is None or not str(val).strip():
                instance.phone = None
            else:
                clean_phone = str(val).strip()
                if not re.match(PHONE_REGEX, clean_phone):
                    return Response(
                        {"error": {"details": {"phone": [PHONE_INVALID_ERROR]}}},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if User.objects.filter(phone=clean_phone).exclude(id=instance.id).exists():
                    return Response(
                        {"error": {"details": {"phone": [PHONE_ALREADY_EXISTS_ERROR]}}},
                        status=status.HTTP_409_CONFLICT,
                    )
                instance.phone = clean_phone

        # Update role if provided
        if "role" in request.data:
            new_role = request.data["role"]
            if new_role in UserRole.values:
                instance.role = new_role
                instance.is_staff = (new_role != UserRole.CUSTOMER)
                if new_role == UserRole.ADMIN:
                    instance.is_superuser = True
                elif instance.is_superuser and new_role != UserRole.ADMIN:
                    instance.is_superuser = False

        # Update is_active status if provided
        if "is_active" in request.data:
            instance.is_active = bool(request.data["is_active"])

        instance.save()
        return Response(UserSerializer(instance).data, status=status.HTTP_200_OK)
