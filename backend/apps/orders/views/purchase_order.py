from django.db.models import Q
from rest_framework import generics, permissions
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.orders.serializers import (
    PurchaseOrderSerializer,
    PurchaseOrderDetailSerializer,
)


class PurchaseOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            queryset = (
                PurchaseOrder.objects.all()
                .select_related("user")
                .prefetch_related(
                    "details__plant_detail__plant",
                    "details__plant_detail__media",
                )
            )
        else:
            queryset = (
                PurchaseOrder.objects.filter(user=user)
                .select_related("user")
                .prefetch_related(
                    "details__plant_detail__plant",
                    "details__plant_detail__media",
                )
            )

        # Search filter
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(order_code__icontains=search)
                | Q(recipient_name__icontains=search)
                | Q(recipient_phone__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__full_name__icontains=search)
                | Q(shipping_address__icontains=search)
            )

        # Status filter
        status_param = self.request.query_params.get("status", "").strip()
        if status_param and status_param.upper() != "ALL":
            queryset = queryset.filter(status=status_param.upper())

        # Ordering
        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return (
                PurchaseOrder.objects.all()
                .select_related("user")
                .prefetch_related(
                    "details__plant_detail__plant",
                    "details__plant_detail__media",
                )
            )
        return (
            PurchaseOrder.objects.filter(user=user)
            .select_related("user")
            .prefetch_related(
                "details__plant_detail__plant",
                "details__plant_detail__media",
            )
        )


class PurchaseOrderDetailItemListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PurchaseOrderDetail.objects.all().select_related("purchase_order", "plant_detail")
