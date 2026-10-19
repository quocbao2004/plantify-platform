from django.urls import path
from apps.inventory.views.stock import StockBalanceListView, StockAdjustmentView
from apps.inventory.views.assets import PlantAssetListCreateView, PlantAssetDetailView

app_name = "inventory"

urlpatterns = [
    path("stock/", StockBalanceListView.as_view(), name="stock-list"),
    path("adjustments/", StockAdjustmentView.as_view(), name="stock-adjustment"),
    path("assets/", PlantAssetListCreateView.as_view(), name="asset-list-create"),
    path("assets/<uuid:id>/", PlantAssetDetailView.as_view(), name="asset-detail"),
]
