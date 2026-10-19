from django.db.models import QuerySet
from apps.accounts.models import User, UserAddress


def get_user_addresses(user: User) -> QuerySet[UserAddress]:
    """Retrieve addresses of a user ordered with default first."""
    return UserAddress.objects.filter(user=user).order_by("-is_default", "-created_at")
