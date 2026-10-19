import re
import unicodedata
from django.utils.text import slugify


def generate_unique_slug(model_class, text: str, field_name: str = "slug") -> str:
    """Generate slug with vietnamese character normalization and uniqueness."""
    # Convert Vietnamese characters
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    base_slug = slugify(text)
    if not base_slug:
        base_slug = "item"

    slug = base_slug
    counter = 1
    while model_class.objects.filter(**{field_name: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug
