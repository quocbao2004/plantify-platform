from django.db.models import Q
from rest_framework import generics, permissions
from apps.orders.models import ReturnRequest
from apps.orders.serializers import ReturnRequestSerializer


class ReturnRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            queryset = (
                ReturnRequest.objects.all()
                .select_related("user", "order", "order_detail__plant_detail__plant")
                .prefetch_related("order_detail__plant_detail__media")
            )
        else:
            queryset = (
                ReturnRequest.objects.filter(user=user)
                .select_related("user", "order", "order_detail__plant_detail__plant")
                .prefetch_related("order_detail__plant_detail__media")
            )

        # Search filter
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(return_code__icontains=search)
                | Q(order__order_code__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__full_name__icontains=search)
                | Q(user__phone__icontains=search)
                | Q(customer_notes__icontains=search)
                | Q(admin_notes__icontains=search)
            )

        # Status filter
        status_param = self.request.query_params.get("status", "").strip()
        if status_param and status_param.upper() != "ALL":
            queryset = queryset.filter(status=status_param.upper())

        # Request type filter
        type_param = self.request.query_params.get("request_type", "").strip()
        if type_param and type_param.upper() != "ALL":
            queryset = queryset.filter(request_type=type_param.upper())

        # Ordering
        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReturnRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return (
                ReturnRequest.objects.all()
                .select_related("user", "order", "order_detail__plant_detail__plant")
                .prefetch_related("order_detail__plant_detail__media")
            )
        return (
            ReturnRequest.objects.filter(user=user)
            .select_related("user", "order", "order_detail__plant_detail__plant")
            .prefetch_related("order_detail__plant_detail__media")
        )
