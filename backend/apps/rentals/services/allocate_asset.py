from django.db import transaction
from apps.inventory.models.plant_asset import PlantAsset
from apps.inventory.constants.choices import PlantAssetStatus
from apps.rentals.models.contract import RentalContractItem
from apps.rentals.models.booking import RentalAssetBooking
from apps.rentals.constants.choices import RentalItemStatus, RentalBookingStatus
from apps.rentals.selectors.availability import is_asset_available_for_period
from apps.common.exceptions import BusinessRuleError, ConflictError


@transaction.atomic
def allocate_physical_asset(contract_item: RentalContractItem, plant_asset_id: str) -> RentalContractItem:
    """Allocate a physical tree to a rental contract item."""
    asset = PlantAsset.objects.select_for_update().get(id=plant_asset_id)

    # Validate variant match
    if asset.variant_id != contract_item.order_item.variant_id:
        raise BusinessRuleError("Cây vật lý không khớp với loại biến thể trong đơn hàng.")

    # Validate availability without overlap
    if not is_asset_available_for_period(asset, contract_item.start_at, contract_item.end_at):
        raise ConflictError(f"Cây {asset.asset_code} đã có lịch thuê trùng lặp trong khoảng thời gian này.")

    contract_item.plant_asset = asset
    contract_item.status = RentalItemStatus.ALLOCATED
    contract_item.save(update_fields=["plant_asset", "status", "updated_at"])

    RentalAssetBooking.objects.create(
        contract_item=contract_item,
        asset=asset,
        start_at=contract_item.start_at,
        end_at=contract_item.end_at,
        status=RentalBookingStatus.RESERVED,
    )

    asset.status = PlantAssetStatus.RESERVED
    asset.save(update_fields=["status", "updated_at"])
    return contract_item
