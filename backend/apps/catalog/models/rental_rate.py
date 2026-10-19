from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.constants.choices import BillingUnit
from apps.catalog.models.variant import ProductVariant


class RentalRate(UUIDTimeStampedModel):
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="rental_rates",
        verbose_name="Biến thể cây",
    )
    billing_unit = models.CharField(
        max_length=20,
        choices=BillingUnit.choices,
        default=BillingUnit.MONTH,
        verbose_name="Kỳ tính phí",
    )
    price_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Giá thuê (VNĐ)")
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = "catalog_rental_rates"
        unique_together = ("variant", "billing_unit")
        verbose_name = "Bảng giá thuê cây"
        verbose_name_plural = "Bảng giá thuê cây"

    def __str__(self):
        return f"{self.variant.sku} - {self.price_vnd:,}₫ / {self.get_billing_unit_display()}"
