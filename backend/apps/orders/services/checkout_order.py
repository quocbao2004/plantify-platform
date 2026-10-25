import uuid
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from apps.accounts.models import User
from apps.orders.models.cart import Cart, CartItem
from apps.orders.models.order import Order
from apps.orders.models.order_item import OrderItem
from apps.orders.models.stock_reservation import StockReservation
from apps.orders.constants.choices import OrderItemType, OrderStatus, StockReservationStatus
from apps.orders.utils.totals import calculate_order_payable_total
from apps.inventory.services.reserve_stock import reserve_stock_for_sale
from apps.common.exceptions import BusinessRuleError


def generate_unique_order_code() -> str:
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


@transaction.atomic
def checkout_cart_order(user: User, *, shipping_address: dict, payment_method: str = "COD", note: str = "") -> Order:
    cart = Cart.objects.filter(user=user).prefetch_related("items__variant__product", "items__variant__rental_rates").first()
    if not cart or not cart.items.exists():
        raise BusinessRuleError("Giỏ hàng của bạn đang trống.")

    items = list(cart.items.all())
    subtotal_sale = 0
    subtotal_rent = 0
    deposit_total = 0

    order_items_to_create = []
    reservations_to_create = []

    order = Order.objects.create(
        user=user,
        order_code=generate_unique_order_code(),
        status=OrderStatus.PENDING_PAYMENT,
        currency="VND",
        shipping_address_snapshot=shipping_address,
        placed_at=timezone.now(),
    )

    for item in items:
        variant = item.variant
        if item.item_type == OrderItemType.SALE:
            # 1. Lock and reserve sale stock
            reserve_stock_for_sale(variant.id, item.quantity)

            unit_price = variant.sale_price_vnd
            line_total = unit_price * item.quantity
            subtotal_sale += line_total

            order_item = OrderItem.objects.create(
                order=order,
                variant=variant,
                item_type=item.item_type,
                quantity=item.quantity,
                product_name_snapshot=variant.product.name,
                sku_snapshot=variant.sku,
                unit_price_vnd=unit_price,
                line_total_vnd=line_total,
                deposit_total_vnd=0,
            )

            # 2. Track StockReservation
            reservations_to_create.append(
                StockReservation(
                    order_item=order_item,
                    variant=variant,
                    quantity=item.quantity,
                    status=StockReservationStatus.PENDING,
                    expires_at=timezone.now() + timedelta(minutes=30),
                )
            )

        elif item.item_type == OrderItemType.RENT:
            # Monthly/Weekly rental fee snapshot
            rate = variant.rental_rates.filter(is_active=True).first()
            rate_price = rate.price_vnd if rate else 0

            unit_price = rate_price
            line_total = unit_price * item.quantity
            deposit_for_item = variant.deposit_vnd * item.quantity

            subtotal_rent += line_total
            deposit_total += deposit_for_item

            OrderItem.objects.create(
                order=order,
                variant=variant,
                item_type=item.item_type,
                quantity=item.quantity,
                product_name_snapshot=variant.product.name,
                sku_snapshot=variant.sku,
                unit_price_vnd=unit_price,
                line_total_vnd=line_total,
                deposit_total_vnd=deposit_for_item,
                rental_start_at=item.rental_start_at,
                rental_end_at=item.rental_end_at,
            )

    StockReservation.objects.bulk_create(reservations_to_create)

    shipping_fee = 30000  # Default standard delivery
    discount_total = 0
    payable_total = calculate_order_payable_total(
        subtotal_sale_vnd=subtotal_sale,
        subtotal_rent_vnd=subtotal_rent,
        deposit_total_vnd=deposit_total,
        shipping_fee_vnd=shipping_fee,
        discount_total_vnd=discount_total,
    )

    order.subtotal_sale_vnd = subtotal_sale
    order.subtotal_rent_vnd = subtotal_rent
    order.deposit_total_vnd = deposit_total
    order.shipping_fee_vnd = shipping_fee
    order.discount_total_vnd = discount_total
    order.payable_total_vnd = payable_total
    order.save(update_fields=[
        "subtotal_sale_vnd",
        "subtotal_rent_vnd",
        "deposit_total_vnd",
        "shipping_fee_vnd",
        "discount_total_vnd",
        "payable_total_vnd",
        "updated_at",
    ])

    # Clear cart items after successful order creation
    cart.items.all().delete()
    return order
