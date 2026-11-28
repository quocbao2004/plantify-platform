from rest_framework import generics, permissions
from apps.catalog.permissions import IsStaffOrReadOnly
from apps.payments.models import Transaction, Refund
from apps.payments.serializers import TransactionSerializer, RefundSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all().select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")
        return Transaction.objects.filter(user=user).select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = Transaction.objects.select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")
        if self.request.method not in permissions.SAFE_METHODS:
            queryset = queryset.filter(purchase_order__checkout_key__isnull=True)
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset


class RefundQuerysetMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(transaction__user=self.request.user)


class RefundListCreateView(RefundQuerysetMixin, generics.ListCreateAPIView):
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    queryset = Refund.objects.all().select_related("transaction", "processed_by")


class RefundDetailView(RefundQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    queryset = Refund.objects.all().select_related("transaction", "processed_by")
