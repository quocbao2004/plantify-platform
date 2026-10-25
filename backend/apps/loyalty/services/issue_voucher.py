import uuid
from django.db import transaction
from apps.accounts.models import User
from apps.loyalty.models.voucher import Voucher
from apps.loyalty.models.user_voucher import UserVoucher
from apps.loyalty.models.account import LoyaltyAccount
from apps.loyalty.services.redeem_points import redeem_user_points
from apps.loyalty.constants.choices import UserVoucherStatus
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def issue_voucher_for_points(user: User, voucher_id: str) -> UserVoucher:
    voucher = Voucher.objects.get(id=voucher_id)
    if voucher.usage_limit <= 0:
        raise BusinessRuleError("Voucher này đã hết lượt phát hành.")

    if voucher.points_cost > 0:
        idempotency_key = f"VOUCHER-REDEEM-{user.id}-{voucher.id}-{uuid.uuid4().hex[:6]}"
        redeem_user_points(
            user=user,
            points=voucher.points_cost,
            description=f"Đổi {voucher.points_cost} điểm lấy voucher {voucher.code}",
            idempotency_key=idempotency_key,
        )

    user_voucher = UserVoucher.objects.create(
        user=user,
        voucher=voucher,
        status=UserVoucherStatus.ACTIVE,
    )
    voucher.usage_limit -= 1
    voucher.save(update_fields=["usage_limit", "updated_at"])

    return user_voucher
