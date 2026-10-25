from django.db import transaction
from django.utils import timezone
from apps.accounts.models import User
from apps.inventory.constants.choices import PlantAssetStatus, PlantAssetCondition
from apps.rentals.models.contract import RentalContractItem
from apps.rentals.models.inspection import RentalInspection
from apps.rentals.constants.choices import RentalItemStatus, RentalBookingStatus


@transaction.atomic
def process_rental_return(
    contract_item: RentalContractItem,
    *,
    inspector: User,
    condition: str = PlantAssetCondition.GOOD,
    damage_fee_vnd: int = 0,
    notes: str = "",
) -> RentalInspection:
    contract_item.returned_at = timezone.now()
    contract_item.status = RentalItemStatus.RETURNED
    contract_item.save(update_fields=["returned_at", "status", "updated_at"])

    # Release booking
    if hasattr(contract_item, "booking"):
        contract_item.booking.status = RentalBookingStatus.COMPLETED
        contract_item.booking.save(update_fields=["status", "updated_at"])

    # Update plant asset physical state
    if contract_item.plant_asset:
        asset = contract_item.plant_asset
        asset.condition = condition
        asset.status = PlantAssetStatus.AVAILABLE if condition == PlantAssetCondition.GOOD else PlantAssetStatus.MAINTENANCE
        asset.last_inspected_at = timezone.now()
        asset.save(update_fields=["condition", "status", "last_inspected_at", "updated_at"])

    inspection = RentalInspection.objects.create(
        contract_item=contract_item,
        inspected_by=inspector,
        condition=condition,
        damage_fee_vnd=damage_fee_vnd,
        notes=notes,
        inspected_at=timezone.now(),
    )
    return inspection
