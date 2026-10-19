from django.db.models import QuerySet
from apps.rentals.models.contract import RentalContract
from apps.payments.models.deposit_ledger import DepositLedgerEntry


def get_contract_deposit_entries(contract: RentalContract) -> QuerySet[DepositLedgerEntry]:
    return DepositLedgerEntry.objects.filter(rental_contract=contract).order_by("created_at")
