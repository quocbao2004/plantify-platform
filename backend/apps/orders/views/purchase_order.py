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
            return PurchaseOrder.objects.all().select_related("user").prefetch_related("details__plant_detail")
        return PurchaseOrder.objects.filter(user=user).select_related("user").prefetch_related("details__plant_detail")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PurchaseOrder.objects.all().select_related("user").prefetch_related("details__plant_detail")
        return PurchaseOrder.objects.filter(user=user).select_related("user").prefetch_related("details__plant_detail")


class PurchaseOrderDetailItemListCreateView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PurchaseOrderDetail.objects.all().select_related("purchase_order", "plant_detail")
