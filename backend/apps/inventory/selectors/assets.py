from typing import Optional
from django.db.models import QuerySet
from apps.inventory.models.plant_asset import PlantAsset
from apps.inventory.constants.choices import PlantAssetStatus, PlantAssetCondition


def get_available_rental_assets(variant_id: str) -> QuerySet[PlantAsset]:
    """Retrieve physically available plant assets of a specific variant."""
    return PlantAsset.objects.filter(
        variant_id=variant_id,
        status=PlantAssetStatus.AVAILABLE,
        condition__in=[PlantAssetCondition.GOOD, PlantAssetCondition.MINOR_DAMAGE],
    ).order_by("asset_code")


def get_asset_by_code(asset_code: str) -> Optional[PlantAsset]:
    """Retrieve plant asset by unique barcode/asset_code."""
    return PlantAsset.objects.filter(asset_code=asset_code).first()
