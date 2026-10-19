from typing import List
from apps.accounts.models import User
from apps.recommendations.models.activity_event import UserActivityEvent


def get_user_interacted_category_ids(user: User) -> List[str]:
    """Get category IDs the user recently interacted with."""
    return list(
        UserActivityEvent.objects.filter(user=user, product__isnull=False)
        .values_list("product__category_id", flat=True)
        .distinct()[:5]
    )
