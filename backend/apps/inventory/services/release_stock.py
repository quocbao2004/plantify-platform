from django.db import transaction
from apps.inventory.models.stock_balance import StockBalance


@transaction.atomic
def release_stock_reservation(variant_id: str, quantity: int) -> StockBalance:
    """Safely decrement quantity_reserved upon order cancellation/timeout."""
    balance = StockBalance.objects.select_for_update().get(variant_id=variant_id)
    balance.quantity_reserved = max(0, balance.quantity_reserved - quantity)
    balance.save(update_fields=["quantity_reserved", "updated_at"])
    return balance
