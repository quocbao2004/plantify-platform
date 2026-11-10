from rest_framework import generics, permissions
from apps.payments.models import Transaction, Refund
from apps.payments.serializers import TransactionSerializer, RefundSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all().select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")
        return Transaction.objects.filter(user=user).select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all().select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")
        return Transaction.objects.filter(user=user).select_related("user", "purchase_order", "rental_contract").prefetch_related("refunds")


class RefundListCreateView(generics.ListCreateAPIView):
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Refund.objects.all().select_related("transaction", "processed_by")


class RefundDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Refund.objects.all().select_related("transaction", "processed_by")
