import uuid
from django.db import transaction
from apps.inventory.models.stock_balance import StockBalance
from apps.inventory.models.stock_movement import StockMovement
from apps.inventory.constants.choices import StockMovementType


@transaction.atomic
def commit_sale_dispatch(variant_id: str, quantity: int, order_id: uuid.UUID = None, performed_by=None) -> StockBalance:
    """
    Finalize stock deduction when an order is shipped.
    Decrements quantity_on_hand and quantity_reserved, logs StockMovement.
    """
    balance = StockBalance.objects.select_for_update().get(variant_id=variant_id)
    balance.quantity_on_hand = max(0, balance.quantity_on_hand - quantity)
    balance.quantity_reserved = max(0, balance.quantity_reserved - quantity)
    balance.save(update_fields=["quantity_on_hand", "quantity_reserved", "updated_at"])

    StockMovement.objects.create(
        variant=balance.variant,
        movement_type=StockMovementType.SALE_COMMIT,
        quantity_delta=-quantity,
        reference_type="Order",
        reference_id=order_id,
        note=f"Xuất kho bán cho đơn hàng #{order_id}",
        performed_by=performed_by,
    )
    return balance
