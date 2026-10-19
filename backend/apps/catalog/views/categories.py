from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.catalog.models.category import Category
from apps.catalog.serializers.category import CategorySerializer
from apps.catalog.selectors.categories import get_active_categories
from apps.catalog.permissions.products import IsStaffOrReadOnly


class CategoryListView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOrReadOnly]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return get_active_categories()
