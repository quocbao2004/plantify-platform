from rest_framework.permissions import BasePermission


class IsOwnerOfOrder(BasePermission):
    """Ensure user only has access to their own orders, unless staff/admin."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj.user == request.user
