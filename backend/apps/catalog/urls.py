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
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<uuid:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path("plants/", PlantsListCreateView.as_view(), name="plants-list"),
    path("plants/<uuid:pk>/", PlantsDetailView.as_view(), name="plants-detail"),
    path("plant-details/", PlantsDetailItemListCreateView.as_view(), name="plant-details-list"),
    path("plant-details/<uuid:pk>/", PlantsDetailItemView.as_view(), name="plant-details-detail"),
]
