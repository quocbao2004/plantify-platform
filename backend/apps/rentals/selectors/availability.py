from datetime import datetime
from apps.inventory.models.plant_asset import PlantAsset
from apps.rentals.models.booking import RentalAssetBooking
from apps.rentals.constants.choices import RentalBookingStatus


def is_asset_available_for_period(asset: PlantAsset, start_at: datetime, end_at: datetime) -> bool:
    """
    Check if a physical tree has any overlapping active or reserved booking.
    Formula: not (booking.start_at < new_end and booking.end_at > new_start)
    """
    overlapping = RentalAssetBooking.objects.filter(
        asset=asset,
        status__in=[RentalBookingStatus.RESERVED, RentalBookingStatus.ACTIVE],
        start_at__lt=end_at,
        end_at__gt=start_at,
    ).exists()
    return not overlapping
