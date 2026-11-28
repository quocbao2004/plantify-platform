from django.db import transaction
from django.db.models import Q
from rest_framework import generics, permissions, serializers

from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.orders.serializers import PurchaseOrderDetailSerializer, PurchaseOrderSerializer
from apps.orders.services.checkout import update_order_status
from apps.payments.models import Transaction
from config.exceptions import ConflictError


def order_queryset():
    return PurchaseOrder.objects.select_related("user").prefetch_related(
        "details__plant_detail__plant", "details__plant_detail__media", "transactions", "ship_tasks__staff__user",
    )


class PurchaseOrderListCreateView(generics.ListAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["checkout_key"]
    ordering_fields = ["created_at", "updated_at", "total_amount", "order_code", "status"]
    ordering = ["-created_at", "-id"]

    def get_queryset(self):
        user = self.request.user
        params = self.request.query_params
        payment_ref = params.get("payment_ref")
        queryset = order_queryset()
        if not user.is_staff or params.get("mine") == "true" or params.get("checkout_key") or payment_ref:
            queryset = queryset.filter(user=user)
        if payment_ref:
            queryset = queryset.filter(
                transactions__transaction_code=payment_ref, transactions__payment_method=Transaction.PaymentMethod.VNPAY,
            )

        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(order_code__icontains=search)
                | Q(recipient_name__icontains=search)
                | Q(recipient_phone__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__full_name__icontains=search)
                | Q(shipping_address__icontains=search)
            )

        order_status = params.get("status", "").strip().upper()
        if order_status and order_status != "ALL":
            queryset = queryset.filter(status=order_status)
        return queryset


class PurchaseOrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PurchaseOrderSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = order_queryset()
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)

    @transaction.atomic
    def perform_update(self, serializer):
        order = PurchaseOrder.objects.select_for_update().get(pk=serializer.instance.pk)
        serializer.instance = order
        new_status = serializer.validated_data.get("status", order.status)
        if order.checkout_key is not None:
            if set(serializer.validated_data) - {"status", "notes"}:
                raise serializers.ValidationError("Chỉ có thể cập nhật trạng thái và ghi chú của đơn checkout.")
            if new_status != order.status and not update_order_status(order.pk, new_status):
                raise ConflictError("Không thể chuyển đơn sang trạng thái này.")
        serializer.save()
        if order.checkout_key is None and new_status == PurchaseOrder.OrderStatus.DELIVERING:
            from apps.orders.services.shipment import ensure_shipment_for_purchase_order

            ensure_shipment_for_purchase_order(order)


class PurchaseOrderDetailItemListCreateView(generics.ListAPIView):
    serializer_class = PurchaseOrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PurchaseOrderDetail.objects.select_related(
        "purchase_order", "plant_detail__plant",
    ).prefetch_related("plant_detail__media")

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(purchase_order__user=self.request.user)
