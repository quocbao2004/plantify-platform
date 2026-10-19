from django.db.models import QuerySet
from apps.accounts.models import User
from apps.payments.models.refund import Refund


def get_user_refunds(user: User) -> QuerySet[Refund]:
    return Refund.objects.filter(payment__order__user=user).order_by("-created_at")
