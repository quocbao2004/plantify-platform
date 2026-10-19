from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.payments.models.payment import Payment


class PaymentAttempt(UUIDTimeStampedModel):
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    provider = models.CharField(max_length=50, db_index=True)
    provider_transaction_id = models.CharField(max_length=150, null=True, blank=True, db_index=True)
    request_id = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=30)
    provider_response = models.JSONField(default=dict, help_text="Payload phản hồi đã làm sạch secrets")
    occurred_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "payments_payment_attempts"
        verbose_name = "Lịch sử gọi cổng thanh toán"
        verbose_name_plural = "Lịch sử gọi cổng thanh toán"
        ordering = ["-occurred_at"]
