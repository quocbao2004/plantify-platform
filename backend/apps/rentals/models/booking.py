from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.inventory.models.plant_asset import PlantAsset
from apps.rentals.constants.choices import RentalBookingStatus
from apps.rentals.models.contract import RentalContractItem


class RentalAssetBooking(UUIDTimeStampedModel):
    """
    Booking calendar slot allocating a physical asset for a specific time range.
    Guarantees no double-booking per physical tree.
    """
    contract_item = models.OneToOneField(
        RentalContractItem,
        on_delete=models.CASCADE,
        related_name="booking",
    )
    asset = models.ForeignKey(
        PlantAsset,
        on_delete=models.PROTECT,
        related_name="bookings",
        verbose_name="Cây vật lý",
    )
    start_at = models.DateTimeField(db_index=True)
    end_at = models.DateTimeField(db_index=True)
    status = models.CharField(
        max_length=20,
        choices=RentalBookingStatus.choices,
        default=RentalBookingStatus.RESERVED,
        db_index=True,
    )

    class Meta:
        db_table = "rental_asset_bookings"
        verbose_name = "Lịch đặt chỗ cây thuê"
        verbose_name_plural = "Lịch đặt chỗ cây thuê"
        ordering = ["start_at"]

    def __str__(self):
        return f"Booking #{self.asset.asset_code} ({self.start_at.strftime('%d/%m')} - {self.end_at.strftime('%d/%m/%Y')})"
