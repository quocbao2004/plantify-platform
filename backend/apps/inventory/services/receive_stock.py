from django.db import transaction
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.models.stock_movement import StockMovement
from apps.inventory.constants.choices import StockMovementType
from apps.catalog.models.variant import ProductVariant


@transaction.atomic
def receive_new_stock(variant_id: str, quantity: int, note: str = "", performed_by=None) -> StockBalance:
    """Increase quantity on hand when receiving inventory from nursery/suppliers."""
    variant = ProductVariant.objects.get(id=variant_id)
    balance, _ = StockBalance.objects.select_for_update().get_or_create(variant=variant)
    balance.quantity_on_hand += quantity
    balance.save(update_fields=["quantity_on_hand", "updated_at"])

    StockMovement.objects.create(
        variant=variant,
        movement_type=StockMovementType.IMPORT,
        quantity_delta=quantity,
        reference_type="Receipt",
        note=note or "Nhập hàng vào kho",
        performed_by=performed_by,
    )
    return balance
