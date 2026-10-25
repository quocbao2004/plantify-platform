from rest_framework.permissions import BasePermission


class IsAdminOnly(BasePermission):
    """System settings and audit logs are strictly reserved for superusers/admins."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.role == "ADMIN"))
