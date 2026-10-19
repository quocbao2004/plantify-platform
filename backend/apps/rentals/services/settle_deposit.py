from django.db import transaction
from django.utils import timezone
from apps.rentals.models.contract import RentalContract
from apps.rentals.constants.choices import RentalContractStatus, RentalItemStatus
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def settle_rental_contract(contract: RentalContract) -> RentalContract:
    """Finalize contract when all assets have been inspected."""
    unreturned = contract.items.exclude(status=RentalItemStatus.RETURNED).exists()
    if unreturned:
        raise BusinessRuleError("Vẫn còn cây chưa được thu hồi hoặc thẩm định.")

    contract.status = RentalContractStatus.COMPLETED
    contract.completed_at = timezone.now()
    contract.save(update_fields=["status", "completed_at", "updated_at"])
    return contract
