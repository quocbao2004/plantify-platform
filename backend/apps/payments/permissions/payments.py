from rest_framework.permissions import BasePermission


class IsOwnerOfPayment(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj.order and obj.order.user == request.user
