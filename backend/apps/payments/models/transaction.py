from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.models import User
from apps.orders.models import PurchaseOrder
from apps.rentals.models import RentalContract


class Transaction(UUIDTimeStampedModel):
    """
    Transaction model for payments related to purchase orders and rental contracts.
    """
    class TransactionType(models.TextChoices):
        PURCHASE = "PURCHASE", "Thanh toán mua cây"
        RENTAL_DEPOSIT = "RENTAL_DEPOSIT", "Đặt cọc thuê cây"
        RENTAL_RECURRING = "RENTAL_RECURRING", "Thanh toán kỳ thuê cây"
        REFUND = "REFUND", "Hoàn tiền"

    class PaymentMethod(models.TextChoices):
        VNPAY = "VNPAY", "VNPay"
        MOMO = "MOMO", "Ví MoMo"
        BANK_TRANSFER = "BANK_TRANSFER", "Chuyển khoản ngân hàng"
        CASH = "CASH", "Tiền mặt khi nhận hàng"

    class TransactionStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ thanh toán"
        SUCCESS = "SUCCESS", "Thành công"
        FAILED = "FAILED", "Thất bại"
        CANCELLED = "CANCELLED", "Đã hủy"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions",
        verbose_name="Người thực hiện giao dịch",
    )
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
        verbose_name="Đơn mua liên kết",
    )
    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
        verbose_name="Hợp đồng thuê liên kết",
    )
    transaction_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã giao dịch",
    )
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        verbose_name="Số tiền giao dịch",
    )
    transaction_type = models.CharField(
        max_length=30,
        choices=TransactionType.choices,
        default=TransactionType.PURCHASE,
        verbose_name="Loại giao dịch",
    )
    payment_method = models.CharField(
        max_length=30,
        choices=PaymentMethod.choices,
        default=PaymentMethod.VNPAY,
        verbose_name="Phương thức thanh toán",
    )
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái giao dịch",
    )
    payment_gateway_response = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Phản hồi từ cổng thanh toán",
    )
    transaction_date = models.DateTimeField(
        default=timezone.now,
        verbose_name="Thời gian giao dịch",
    )

    class Meta:
        db_table = "transactions"
        verbose_name = "Giao dịch thanh toán"
        verbose_name_plural = "Giao dịch thanh toán"
        ordering = ["-transaction_date"]

    def __str__(self):
        return f"{self.transaction_code} - {self.amount:,.0f} VND ({self.get_status_display()})"
