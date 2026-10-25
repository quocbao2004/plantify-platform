from django.urls import path
from apps.catalog.views.categories import CategoryListView
from apps.catalog.views.products import ProductListView, ProductDetailView
from apps.catalog.views.variants import VariantDetailView

app_name = "catalog"

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("variants/<str:sku>/", VariantDetailView.as_view(), name="variant-detail"),
]
