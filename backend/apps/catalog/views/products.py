from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.catalog.models.product import Product
from apps.catalog.serializers.product_read import ProductListSerializer, ProductDetailSerializer
from apps.catalog.serializers.product_write import ProductWriteSerializer
from apps.catalog.selectors.products import get_products_queryset
from apps.catalog.permissions.products import IsStaffOrReadOnly


class ProductListView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "light_requirement", "care_level"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return get_products_queryset()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductWriteSerializer
        return ProductListSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        return get_products_queryset()

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return ProductWriteSerializer
        return ProductDetailSerializer
