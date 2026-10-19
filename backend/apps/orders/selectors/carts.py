from apps.accounts.models import User
from apps.orders.models.cart import Cart, CartStatus


def get_user_cart(user: User) -> Cart:
    """Retrieve or initialize user's active cart preloading items and variants."""
    cart, _ = Cart.objects.prefetch_related(
        "items__variant__product",
        "items__variant__rental_rates",
    ).get_or_create(user=user, status=CartStatus.ACTIVE)
    return cart
