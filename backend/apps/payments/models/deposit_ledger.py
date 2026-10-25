from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.rentals.models.contract import RentalContract
from apps.payments.models.payment_allocation import PaymentAllocation
from apps.payments.models.refund import Refund
from apps.payments.constants.choices import DepositEntryType


class DepositLedgerEntry(UUIDTimeStampedModel):
    """
    Append-only accounting ledger tracking customer rental deposit balance.
    Formula: Balance = SUM(HELD) - SUM(REFUNDED) - SUM(WITHHELD) >= 0.
    """
    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.PROTECT,
        related_name="deposit_ledger_entries",
    )
    entry_type = models.CharField(
        max_length=20,
        choices=DepositEntryType.choices,
        db_index=True,
    )
    amount_vnd = models.PositiveBigIntegerField(verbose_name="Số tiền biến động cọc (VNĐ)")
    payment_allocation = models.ForeignKey(
        PaymentAllocation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deposit_entries",
    )
    refund = models.ForeignKey(
        Refund,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deposit_entries",
    )
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "payments_deposit_ledger"
        verbose_name = "Sổ quỹ tiền cọc thuê cây"
        verbose_name_plural = "Sổ quỹ tiền cọc thuê cây"
        ordering = ["created_at"]

    def __str__(self):
        return f"[{self.get_entry_type_display()}] {self.amount_vnd:,}₫ - Contract #{self.rental_contract.contract_code}"
