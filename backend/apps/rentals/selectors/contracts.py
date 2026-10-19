from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.rentals.models.contract import RentalContract


def get_user_rental_contracts(user: User) -> QuerySet[RentalContract]:
    """Retrieve rental contracts for user with items and assets preloaded."""
    return (
        RentalContract.objects.filter(user=user)
        .prefetch_related("items__plant_asset__variant__product")
        .order_by("-created_at")
    )


def get_rental_contract_by_id(contract_id: str, user: Optional[User] = None) -> Optional[RentalContract]:
    """Retrieve single rental contract by UUID."""
    qs = RentalContract.objects.filter(id=contract_id).prefetch_related(
        "items__plant_asset__variant__product",
        "items__extension_requests",
        "items__inspections",
    )
    if user and not user.is_staff:
        qs = qs.filter(user=user)
    return qs.first()
