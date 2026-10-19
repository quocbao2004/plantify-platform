from django.contrib import admin
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.models.stock_movement import StockMovement
from apps.inventory.models.plant_asset import PlantAsset


@admin.register(StockBalance)
class StockBalanceAdmin(admin.ModelAdmin):
    list_display = ("variant", "quantity_on_hand", "quantity_reserved", "available_for_sale", "updated_at")
    search_fields = ("variant__sku", "variant__product__name")


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("variant", "movement_type", "quantity_delta", "reference_type", "reference_id", "performed_by", "created_at")
    list_filter = ("movement_type", "created_at")
    search_fields = ("variant__sku", "note")


@admin.register(PlantAsset)
class PlantAssetAdmin(admin.ModelAdmin):
    list_display = ("asset_code", "variant", "condition", "status", "acquired_at", "last_inspected_at")
    list_filter = ("condition", "status")
    search_fields = ("asset_code", "variant__sku", "variant__product__name")
