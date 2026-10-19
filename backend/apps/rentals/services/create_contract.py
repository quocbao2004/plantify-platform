import uuid
from django.db import transaction
from django.utils import timezone
from apps.orders.models.order import Order
from apps.orders.constants.choices import OrderItemType
from apps.rentals.models.contract import RentalContract, RentalContractItem
from apps.rentals.constants.choices import RentalContractStatus, RentalItemStatus
from apps.common.exceptions import BusinessRuleError


def generate_unique_contract_code() -> str:
    return f"HDT-{uuid.uuid4().hex[:8].upper()}"


@transaction.atomic
def create_rental_contract_for_order(order: Order) -> RentalContract:
    """
    Create RentalContract and expand 1 RentalContractItem per individual asset quantity.
    """
    rental_items = order.items.filter(item_type=OrderItemType.RENT)
    if not rental_items.exists():
        raise BusinessRuleError("Đơn hàng không chứa sản phẩm thuê cây cảnh.")

    contract = RentalContract.objects.create(
        order=order,
        user=order.user,
        contract_code=generate_unique_contract_code(),
        status=RentalContractStatus.PENDING_DELIVERY,
        deposit_total_vnd=order.deposit_total_vnd,
        signed_at=timezone.now(),
    )

    items_to_create = []
    for oi in rental_items:
        # Create 1 item per physical tree
        unit_fee = oi.unit_price_vnd
        unit_deposit = oi.variant.deposit_vnd
        for _ in range(oi.quantity):
            items_to_create.append(
                RentalContractItem(
                    contract=contract,
                    order_item=oi,
                    start_at=oi.rental_start_at or timezone.now(),
                    end_at=oi.rental_end_at or (timezone.now() + timezone.timedelta(days=30)),
                    rental_fee_vnd=unit_fee,
                    deposit_vnd=unit_deposit,
                    status=RentalItemStatus.PENDING_ALLOCATION,
                )
            )

    RentalContractItem.objects.bulk_create(items_to_create)
    return contract
