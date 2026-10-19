from django.db.models import QuerySet
from django.utils import timezone
from apps.accounts.models import User
from apps.loyalty.models.voucher import Voucher
from apps.loyalty.models.user_voucher import UserVoucher
from apps.loyalty.constants.choices import UserVoucherStatus


def get_available_public_vouchers() -> QuerySet[Voucher]:
    now = timezone.now()
    return Voucher.objects.filter(valid_from__lte=now, valid_to__gte=now).order_by("-valid_from")


def get_user_vouchers(user: User) -> QuerySet[UserVoucher]:
    return UserVoucher.objects.filter(user=user, status=UserVoucherStatus.ACTIVE).select_related("voucher").order_by("-created_at")
