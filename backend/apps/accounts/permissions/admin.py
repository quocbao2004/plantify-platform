from rest_framework import permissions
from apps.accounts.constants.choices import UserRole


class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role == UserRole.ADMIN)
        )
