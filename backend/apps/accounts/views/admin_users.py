from rest_framework import generics
from django.db.models import Q
from apps.accounts.models import User
from apps.accounts.serializers.user import UserSerializer
from apps.accounts.permissions.admin import IsAdminOnly


class AdminUserListView(generics.ListAPIView):
    """
    Admin-only endpoint to list and search customer/user accounts.
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOnly]
    lookup_field = "id"
