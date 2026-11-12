import uuid
from django.db.models import Q
from rest_framework import generics, permissions
from apps.catalog.models import Category, Plants, PlantsDetail
from apps.catalog.serializers import (
    CategorySerializer,
    PlantsSerializer,
    PlantsDetailSerializer,
)


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        is_active_param = self.request.query_params.get("is_active", "").strip().lower()
        if is_active_param in ("all", "any") or (self.request.user and self.request.user.is_staff):
            return Category.objects.all()
        return Category.objects.filter(is_active=True)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class PlantsListCreateView(generics.ListCreateAPIView):
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        is_active_param = self.request.query_params.get("is_active", "").strip().lower()
        if is_active_param in ("true", "1"):
            queryset = Plants.objects.filter(is_active=True)
        elif is_active_param in ("false", "0"):
            queryset = Plants.objects.filter(is_active=False)
        elif is_active_param in ("all", "any") or (self.request.user and self.request.user.is_staff):
            queryset = Plants.objects.all()
        else:
            # Default for storefront
            queryset = Plants.objects.filter(is_active=True)

        queryset = queryset.select_related("category").prefetch_related("details__media")

        # Search filter
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(slug__icontains=search)
                | Q(category__name__icontains=search)
            )

        # Category filter
        category = self.request.query_params.get("category", "").strip()
        if category and category.upper() != "ALL":
            try:
                cat_uuid = uuid.UUID(category)
                queryset = queryset.filter(category__id=cat_uuid)
            except ValueError:
                queryset = queryset.filter(category__slug=category)

        # Ordering
        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset


class PlantsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plants.objects.all().select_related("category").prefetch_related("details__media")
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg) or self.kwargs.get("pk") or self.kwargs.get("slug")
        try:
            val_uuid = uuid.UUID(str(val))
            return generics.get_object_or_404(queryset, id=val_uuid)
        except (ValueError, TypeError):
            return generics.get_object_or_404(queryset, slug=val)


class PlantsDetailItemListCreateView(generics.ListCreateAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]


class PlantsDetailItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]
