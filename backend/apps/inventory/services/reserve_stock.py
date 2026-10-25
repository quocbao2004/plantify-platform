from django.db import transaction
from apps.inventory.models.stock_balance import StockBalance
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def reserve_stock_for_sale(variant_id: str, quantity: int) -> StockBalance:
    """Lock stock row and increase quantity_reserved for pending order."""
    balance = StockBalance.objects.select_for_update().get(variant_id=variant_id)
    available = balance.quantity_on_hand - balance.quantity_reserved
    if available < quantity:
        raise BusinessRuleError(f"Sản phẩm {balance.variant.sku} không đủ tồn kho khả dụng để đặt hàng.")

    balance.quantity_reserved += quantity
    balance.save(update_fields=["quantity_reserved", "updated_at"])
    return balance
