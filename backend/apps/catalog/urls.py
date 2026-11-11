from django.urls import path
from apps.catalog.views import (
    CategoryListCreateView,
    CategoryDetailView,
    PlantsListCreateView,
    PlantsDetailView,
    PlantsDetailItemListCreateView,
    PlantsDetailItemView,
)

app_name = "catalog"

urlpatterns = [
    # Categories
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<uuid:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    # Plants
    path("plants/", PlantsListCreateView.as_view(), name="plants-list"),
    path("plants/<str:pk>/", PlantsDetailView.as_view(), name="plants-detail"),
    path("plant-details/", PlantsDetailItemListCreateView.as_view(), name="plant-details-list"),
    path("plant-details/<uuid:pk>/", PlantsDetailItemView.as_view(), name="plant-details-detail"),

    # Backward-compatible Product Aliases for Frontend
    path("products/", PlantsListCreateView.as_view(), name="product-list"),
    path("products/<str:pk>/", PlantsDetailView.as_view(), name="product-detail"),
]
