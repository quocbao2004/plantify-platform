from typing import Optional
from apps.inventory.models.stock_balance import StockBalance


def get_stock_balance_by_variant_id(variant_id: str) -> Optional[StockBalance]:
    """Retrieve stock balance for a product variant."""
    return StockBalance.objects.filter(variant_id=variant_id).first()
