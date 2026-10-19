from django.db.models import QuerySet
from apps.reviews.models.review import ProductReview
from apps.reviews.constants.choices import ReviewStatus


def get_product_published_reviews(product_id: str) -> QuerySet[ProductReview]:
    """Retrieve published reviews for a product."""
    return (
        ProductReview.objects.filter(product_id=product_id, status=ReviewStatus.PUBLISHED)
        .select_related("user")
        .order_by("-created_at")
    )
