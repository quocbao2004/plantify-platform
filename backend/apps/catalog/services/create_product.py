from django.db import transaction
from apps.catalog.models.product import Product


@transaction.atomic
def create_product(*, category_id: str, name: str, **kwargs) -> Product:
    """Create a new product within an atomic transaction."""
    product = Product.objects.create(category_id=category_id, name=name, **kwargs)
    return product
