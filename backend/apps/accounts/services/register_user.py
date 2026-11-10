from django.db import IntegrityError, transaction
from apps.accounts.models import User
from apps.accounts.constants import (
    EMAIL_ALREADY_EXISTS_ERROR,
    PHONE_REQUIRED_ERROR,
    PHONE_ALREADY_EXISTS_ERROR,
)
from apps.accounts.utils.normalize_email import normalize_email_address
from apps.common.exceptions import ConflictError


@transaction.atomic
def register_user(*, email: str, password: str, full_name: str, phone: str = "") -> User:
    """Register a new customer account with unique email and unique phone number."""
    normalized_email = normalize_email_address(email).lower()
    clean_phone = phone.strip() if phone else ""

    if User.objects.filter(email__iexact=normalized_email).exists():
        raise ConflictError({"email": [EMAIL_ALREADY_EXISTS_ERROR]})

    if not clean_phone:
        raise ConflictError({"phone": [PHONE_REQUIRED_ERROR]})

    if User.objects.filter(phone=clean_phone).exists():
        raise ConflictError({"phone": [PHONE_ALREADY_EXISTS_ERROR]})

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                email=normalized_email,
                password=password,
                full_name=full_name.strip(),
                phone=clean_phone,
            )
    except IntegrityError as exc:
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise ConflictError({"email": [EMAIL_ALREADY_EXISTS_ERROR]}) from exc
        if User.objects.filter(phone=clean_phone).exists():
            raise ConflictError({"phone": [PHONE_ALREADY_EXISTS_ERROR]}) from exc
        raise
    return user
