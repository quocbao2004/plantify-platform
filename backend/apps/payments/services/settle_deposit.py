from django.db import transaction
from apps.rentals.models.contract import RentalContract
from apps.payments.models.deposit_ledger import DepositLedgerEntry
from apps.payments.constants.choices import DepositEntryType
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def record_deposit_settlement(contract: RentalContract, *, damage_deduction_vnd: int = 0, refund_amount_vnd: int = 0):
    """
    Record ledger entries for deposit settlement:
    - WITHHELD for damage deduction
    - REFUNDED for returned balance
    """
    total_held = contract.deposit_total_vnd

    if damage_deduction_vnd + refund_amount_vnd > total_held:
        raise BusinessRuleError("Tổng khấu trừ và hoàn tiền cọc vượt quá số tiền cọc đã giữ.")

    if damage_deduction_vnd > 0:
        DepositLedgerEntry.objects.create(
            rental_contract=contract,
            entry_type=DepositEntryType.WITHHELD,
            amount_vnd=damage_deduction_vnd,
            note="Khấu trừ tiền cọc do cây bị hư hại hoặc quá hạn",
        )

    if refund_amount_vnd > 0:
        DepositLedgerEntry.objects.create(
            rental_contract=contract,
            entry_type=DepositEntryType.REFUNDED,
            amount_vnd=refund_amount_vnd,
            note="Hoàn trả tiền cọc cho khách hàng",
        )
