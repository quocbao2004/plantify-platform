from django.db import transaction
from apps.catalog.models.product import Product


@transaction.atomic
def update_product(product: Product, **kwargs) -> Product:
    """Update product fields cleanly."""
    for field, value in kwargs.items():
        if value is not None:
            setattr(product, field, value)
    product.save()
    return product
