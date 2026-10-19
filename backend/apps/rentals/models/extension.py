from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.rentals.constants.choices import ExtensionRequestStatus
from apps.rentals.models.contract import RentalContractItem


class RentalExtensionRequest(UUIDTimeStampedModel):
    contract_item = models.ForeignKey(
        RentalContractItem,
        on_delete=models.CASCADE,
        related_name="extension_requests",
    )
    requested_end_at = models.DateTimeField(verbose_name="Ngày mong muốn gia hạn đến")
    reason = models.TextField(blank=True, verbose_name="Lý do gia hạn")
    status = models.CharField(
        max_length=20,
        choices=ExtensionRequestStatus.choices,
        default=ExtensionRequestStatus.PENDING,
        db_index=True,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_rental_extensions",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    additional_fee_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Phí thuê gia hạn bổ sung (VNĐ)")

    class Meta:
        db_table = "rental_extension_requests"
        verbose_name = "Yêu cầu gia hạn hợp đồng thuê"
        verbose_name_plural = "Yêu cầu gia hạn hợp đồng thuê"
        ordering = ["-created_at"]
