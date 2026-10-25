from typing import Optional
from django.db.models import QuerySet
from apps.catalog.models.category import Category


def get_active_categories() -> QuerySet[Category]:
    """Retrieve all active root categories and subcategories."""
    return Category.objects.filter(is_active=True).order_by("sort_order", "name")


def get_category_by_slug(slug: str) -> Optional[Category]:
    """Retrieve category by slug."""
    return Category.objects.filter(slug=slug, is_active=True).first()
