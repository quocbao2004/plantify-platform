from rest_framework.permissions import BasePermission


class IsOwnerOfRentalContract(BasePermission):
    """Ensure user is owner of contract or staff."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj.user == request.user
