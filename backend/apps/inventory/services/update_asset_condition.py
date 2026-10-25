from django.db import transaction
from django.utils import timezone
from apps.inventory.models.plant_asset import PlantAsset


@transaction.atomic
def update_plant_asset_condition(asset_code: str, condition: str, status: str = None) -> PlantAsset:
    """Update biological condition and operational status of a rental asset."""
    asset = PlantAsset.objects.select_for_update().get(asset_code=asset_code)
    asset.condition = condition
    if status is not None:
        asset.status = status
    asset.last_inspected_at = timezone.now()
    asset.save(update_fields=["condition", "status", "last_inspected_at", "updated_at"])
    return asset
