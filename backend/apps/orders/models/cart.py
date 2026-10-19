from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.variant import ProductVariant
from apps.orders.constants.choices import CartStatus, OrderItemType


class Cart(UUIDTimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    status = models.CharField(
        max_length=20,
        choices=CartStatus.choices,
        default=CartStatus.ACTIVE,
        db_index=True,
    )

    class Meta:
        db_table = "orders_carts"
        verbose_name = "Giỏ hàng"
        verbose_name_plural = "Giỏ hàng"


class CartItem(UUIDTimeStampedModel):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="cart_items",
    )
    item_type = models.CharField(
        max_length=10,
        choices=OrderItemType.choices,
        default=OrderItemType.SALE,
        db_index=True,
    )
    quantity = models.PositiveIntegerField(default=1)

    # Required for RENT item_type
    rental_start_at = models.DateTimeField(null=True, blank=True)
    rental_end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders_cart_items"
        verbose_name = "Mục trong giỏ hàng"
        verbose_name_plural = "Mục trong giỏ hàng"
