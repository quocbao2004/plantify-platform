from django.db import transaction
from apps.accounts.models import User
from apps.catalog.models.variant import ProductVariant
from apps.orders.models.cart import Cart, CartItem
from apps.orders.constants.choices import CartStatus, OrderItemType
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def add_item_to_cart(
    user: User,
    *,
    variant_id: str,
    item_type: str = OrderItemType.SALE,
    quantity: int = 1,
    rental_start_at=None,
    rental_end_at=None,
) -> CartItem:
    if quantity <= 0:
        raise BusinessRuleError("Số lượng sản phẩm phải lớn hơn 0.")

    variant = ProductVariant.objects.get(id=variant_id, is_active=True)
    if item_type == OrderItemType.SALE and not variant.can_sell:
        raise BusinessRuleError(f"Sản phẩm {variant.sku} không được cấu hình để bán.")
    if item_type == OrderItemType.RENT and not variant.can_rent:
        raise BusinessRuleError(f"Sản phẩm {variant.sku} không được cấu hình để cho thuê.")

    if item_type == OrderItemType.RENT:
        if not rental_start_at or not rental_end_at:
            raise BusinessRuleError("Cần chỉ định ngày bắt đầu và ngày kết thúc thuê.")
        if rental_end_at <= rental_start_at:
            raise BusinessRuleError("Thời gian kết thúc thuê phải lớn hơn thời gian bắt đầu.")

    cart, _ = Cart.objects.get_or_create(user=user, status=CartStatus.ACTIVE)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        variant=variant,
        item_type=item_type,
        defaults={
            "quantity": quantity,
            "rental_start_at": rental_start_at,
            "rental_end_at": rental_end_at,
        },
    )
    if not created:
        item.quantity += quantity
        item.save(update_fields=["quantity", "updated_at"])

    return item
