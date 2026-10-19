from datetime import datetime
from django.db import transaction
from apps.rentals.models.contract import RentalContractItem
from apps.rentals.models.extension import RentalExtensionRequest
from apps.rentals.constants.choices import ExtensionRequestStatus
from apps.rentals.selectors.availability import is_asset_available_for_period
from apps.common.exceptions import BusinessRuleError, ConflictError


@transaction.atomic
def request_rental_extension(
    contract_item: RentalContractItem,
    *,
    requested_end_at: datetime,
    reason: str = "",
    additional_fee_vnd: int = 0,
) -> RentalExtensionRequest:
    if requested_end_at <= contract_item.end_at:
        raise BusinessRuleError("Thời gian gia hạn phải lớn hơn ngày kết thúc hiện tại.")

    # If already allocated, check overlap
    if contract_item.plant_asset:
        if not is_asset_available_for_period(contract_item.plant_asset, contract_item.end_at, requested_end_at):
            raise ConflictError("Cây đã có lịch đặt chỗ tiếp theo, không thể gia hạn.")

    ext = RentalExtensionRequest.objects.create(
        contract_item=contract_item,
        requested_end_at=requested_end_at,
        reason=reason,
        additional_fee_vnd=additional_fee_vnd,
        status=ExtensionRequestStatus.PENDING,
    )
    return ext
