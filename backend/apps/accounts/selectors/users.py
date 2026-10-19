from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.accounts.utils.normalize_email import normalize_email_address


def get_user_by_id(user_id: str) -> Optional[User]:
    """Retrieve user by UUID."""
    return User.objects.filter(id=user_id, is_active=True).first()


def get_user_by_email(email: str) -> Optional[User]:
    """Retrieve user by normalized email."""
    normalized = normalize_email_address(email)
    return User.objects.filter(email=normalized, is_active=True).first()
