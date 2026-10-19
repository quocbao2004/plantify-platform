from rest_framework import generics
from apps.catalog.models.variant import ProductVariant
from apps.catalog.serializers.variant import ProductVariantSerializer
from apps.catalog.permissions.products import IsStaffOrReadOnly


class VariantDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsStaffOrReadOnly]
    serializer_class = ProductVariantSerializer
    queryset = ProductVariant.objects.all()
    lookup_field = "sku"
