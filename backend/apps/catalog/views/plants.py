from rest_framework import generics, permissions
from apps.catalog.models import Category, Plants, PlantsDetail
from apps.catalog.serializers import (
    CategorySerializer,
    PlantsSerializer,
    PlantsDetailSerializer,
)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class PlantsListCreateView(generics.ListCreateAPIView):
    queryset = Plants.objects.filter(is_active=True).select_related("category").prefetch_related("details__media")
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]


class PlantsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plants.objects.all().select_related("category").prefetch_related("details__media")
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]


class PlantsDetailItemListCreateView(generics.ListCreateAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]


class PlantsDetailItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]
