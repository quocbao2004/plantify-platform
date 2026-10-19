from rest_framework.permissions import BasePermission


class IsOwnerOfAddress(BasePermission):
    """Ensure user is only modifying their own address."""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
