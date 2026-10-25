from django.db.models import QuerySet
from apps.catalog.models.product import Product


def get_candidate_products_by_category(category_ids: list) -> QuerySet[Product]:
    return (
        Product.objects.filter(is_active=True, category_id__in=category_ids)
        .prefetch_related("images", "variants")
        .order_by("-created_at")[:10]
    )


def get_similar_products_to_product(product: Product) -> QuerySet[Product]:
    return (
        Product.objects.filter(
            is_active=True,
            category=product.category,
            light_requirement=product.light_requirement,
        )
        .exclude(id=product.id)
        .prefetch_related("images", "variants")[:6]
    )
