from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.models.order import Order
from apps.rentals.models.contract import RentalContract
from apps.payments.constants.choices import PaymentPurpose, PaymentMethod, PaymentStatus


class Payment(UUIDTimeStampedModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )
    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )
    purpose = models.CharField(
        max_length=30,
        choices=PaymentPurpose.choices,
        default=PaymentPurpose.CHECKOUT,
        db_index=True,
    )
    amount_vnd = models.PositiveBigIntegerField(verbose_name="Số tiền giao dịch (VNĐ)")
    method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.COD,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )
    idempotency_key = models.CharField(max_length=128, unique=True, db_index=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments_payments"
        verbose_name = "Khoản thanh toán"
        verbose_name_plural = "Khoản thanh toán"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment #{self.id} - {self.amount_vnd:,}₫ ({self.get_status_display()})"
