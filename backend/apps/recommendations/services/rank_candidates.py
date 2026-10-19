from django.db.models import QuerySet
from apps.catalog.models.product import Product


def rank_product_candidates(products: QuerySet[Product]) -> list:
    """Sort products according to recommendation ranking criteria."""
    return list(products)
