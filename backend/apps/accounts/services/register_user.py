from django.db import transaction
from apps.accounts.models import User
from apps.accounts.utils.normalize_email import normalize_email_address
from apps.common.exceptions import ConflictError


@transaction.atomic
def register_user(*, email: str, password: str, full_name: str, phone: str = "") -> User:
    """Register a new customer account."""
    normalized_email = normalize_email_address(email)
    if User.objects.filter(email=normalized_email).exists():
        raise ConflictError("Địa chỉ email này đã được sử dụng trên hệ thống.")

    user = User.objects.create_user(
        email=normalized_email,
        password=password,
        full_name=full_name.strip(),
        phone=phone.strip(),
    )
    return user
