from apps.accounts.models import User
from apps.catalog.models.product import Product
from apps.recommendations.models.recommendation_log import RecommendationLog
from apps.recommendations.constants.choices import RecommendationStrategy
from apps.recommendations.selectors.user_interactions import get_user_interacted_category_ids
from apps.recommendations.selectors.candidates import get_candidate_products_by_category, get_similar_products_to_product


def recommend_for_user(user: User = None) -> list:
    """Rule-based recommendation based on user preference and recent interaction."""
    products = []
    if user and user.is_authenticated:
        cat_ids = get_user_interacted_category_ids(user)
        if cat_ids:
            products = list(get_candidate_products_by_category(cat_ids))

    if not products:
        products = list(Product.objects.filter(is_active=True).prefetch_related("images", "variants")[:8])

    # Log recommendation
    RecommendationLog.objects.create(
        user=user if user and user.is_authenticated else None,
        strategy=RecommendationStrategy.RULE_BASED,
        product_ids=[str(p.id) for p in products],
        context={"source": "homepage"},
    )
    return products


def recommend_similar_products(product_id: str) -> list:
    product = Product.objects.get(id=product_id)
    return list(get_similar_products_to_product(product))
