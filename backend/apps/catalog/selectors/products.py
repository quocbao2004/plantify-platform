from typing import Optional
from django.db.models import QuerySet
from apps.catalog.models.product import Product


def get_products_queryset() -> QuerySet[Product]:
    """
    Optimized product list queryset prefetching images and variants
    to avoid N+1 query problem.
    """
    return (
        Product.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("images", "variants__rental_rates")
        .order_by("-created_at")
    )


def get_product_by_slug(slug: str) -> Optional[Product]:
    """Retrieve product detail by unique slug with relations."""
    return (
        Product.objects.filter(slug=slug, is_active=True)
        .select_related("category")
        .prefetch_related("images", "variants__rental_rates")
        .first()
    )
