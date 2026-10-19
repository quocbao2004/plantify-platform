from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.payments.models.payment import Payment


def get_user_payments(user: User) -> QuerySet[Payment]:
    """Retrieve payments initiated by user via orders or contracts."""
    return Payment.objects.filter(order__user=user).prefetch_related("allocations").order_by("-created_at")


def get_payment_by_idempotency_key(key: str) -> Optional[Payment]:
    return Payment.objects.filter(idempotency_key=key).first()
