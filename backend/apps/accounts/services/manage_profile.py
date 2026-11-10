from django.db import transaction
from apps.accounts.models import User
from apps.accounts.constants import (
    PHONE_REQUIRED_ERROR,
    PHONE_ALREADY_EXISTS_ERROR,
)
from apps.common.exceptions import ConflictError


@transaction.atomic
def update_profile(user: User, *, full_name: str = None, phone: str = None) -> User:
    """Update profile basic info with unique phone number verification."""
    update_fields = ["updated_at"]
    if full_name is not None:
        user.full_name = full_name.strip()
        update_fields.append("full_name")
    if phone is not None:
        clean_phone = phone.strip()
        if not clean_phone:
            raise ConflictError({"phone": [PHONE_REQUIRED_ERROR]})
        if User.objects.filter(phone=clean_phone).exclude(id=user.id).exists():
            raise ConflictError({"phone": [PHONE_ALREADY_EXISTS_ERROR]})
        user.phone = clean_phone
        update_fields.append("phone")
    user.save(update_fields=update_fields)
    return user
