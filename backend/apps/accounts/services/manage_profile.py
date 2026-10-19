from django.db import transaction
from apps.accounts.models import User, UserAddress, UserPreference


@transaction.atomic
def update_profile(user: User, *, full_name: str = None, phone: str = None) -> User:
    """Update profile basic info."""
    update_fields = ["updated_at"]
    if full_name is not None:
        user.full_name = full_name.strip()
        update_fields.append("full_name")
    if phone is not None:
        user.phone = phone.strip()
        update_fields.append("phone")
    user.save(update_fields=update_fields)
    return user


@transaction.atomic
def create_or_update_address(user: User, address_id: str = None, **address_data) -> UserAddress:
    """Create or update user address ensuring only 1 default address exists."""
    is_default = address_data.get("is_default", False)
    if is_default:
        UserAddress.objects.filter(user=user).update(is_default=False)

    if address_id:
        addr = UserAddress.objects.get(id=address_id, user=user)
        for key, value in address_data.items():
            setattr(addr, key, value)
        addr.save()
        return addr

    return UserAddress.objects.create(user=user, **address_data)


@transaction.atomic
def update_user_preferences(user: User, **pref_data) -> UserPreference:
    """Create or update user plant preferences."""
    pref, _ = UserPreference.objects.get_or_create(user=user)
    for key, value in pref_data.items():
        setattr(pref, key, value)
    pref.save()
    return pref
