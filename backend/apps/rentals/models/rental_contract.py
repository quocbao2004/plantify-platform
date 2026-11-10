from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .rental_order import RentalOrder


class RentalContract(UUIDTimeStampedModel):
    """
    RentalContract model legally binding a rental order.
    """
    class ContractStatus(models.TextChoices):
        DRAFT = "DRAFT", "Dự thảo"
        ACTIVE = "ACTIVE", "Đang hiệu lực"
        COMPLETED = "COMPLETED", "Đã thanh lý"
        TERMINATED = "TERMINATED", "Chấm dứt trước hạn"

    rental_order = models.OneToOneField(
        RentalOrder,
        on_delete=models.CASCADE,
        related_name="contract",
        verbose_name="Đơn thuê liên kết",
    )
    contract_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Số hợp đồng",
    )
    signed_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Ngày ký kết",
    )
    start_date = models.DateField(verbose_name="Ngày bắt đầu hiệu lực")
    end_date = models.DateField(verbose_name="Ngày kết thúc hiệu lực")
    total_value = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Tổng giá trị hợp đồng",
    )
    deposit_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Tiền cọc giữ cây",
    )
    status = models.CharField(
        max_length=20,
        choices=ContractStatus.choices,
        default=ContractStatus.DRAFT,
        db_index=True,
        verbose_name="Trạng thái hợp đồng",
    )
    terms_and_conditions = models.TextField(blank=True, verbose_name="Điều khoản hợp đồng")
    contract_file_url = models.URLField(max_length=500, blank=True, verbose_name="File hợp đồng (PDF)")

    class Meta:
        db_table = "rental_contracts"
        verbose_name = "Hợp đồng thuê"
        verbose_name_plural = "Hợp đồng thuê"
        ordering = ["-created_at"]

    def __str__(self):
        return f"HĐ {self.contract_code} ({self.get_status_display()})"
