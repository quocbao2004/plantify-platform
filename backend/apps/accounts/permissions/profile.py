from rest_framework.permissions import BasePermission
from apps.accounts.constants.choices import UserRole


class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        return (
            request.user.is_staff
            or request.user.role == UserRole.ADMIN
            or obj == request.user
        )
