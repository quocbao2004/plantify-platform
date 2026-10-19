from rest_framework.permissions import BasePermission


class IsStaffForInventory(BasePermission):
    """Only staff/admin can modify or view inventory internal balances and movements."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
