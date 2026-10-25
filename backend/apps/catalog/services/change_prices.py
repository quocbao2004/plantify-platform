from django.db import transaction
from apps.catalog.models.variant import ProductVariant
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def change_variant_prices(variant: ProductVariant, *, sale_price_vnd: int = None, deposit_vnd: int = None) -> ProductVariant:
    """Update variant pricing with sanity checks."""
    if sale_price_vnd is not None:
        if sale_price_vnd < 0:
            raise BusinessRuleError("Giá bán không được là số âm.")
        variant.sale_price_vnd = sale_price_vnd

    if deposit_vnd is not None:
        if deposit_vnd < 0:
            raise BusinessRuleError("Tiền đặt cọc không được là số âm.")
        variant.deposit_vnd = deposit_vnd

    variant.save(update_fields=["sale_price_vnd", "deposit_vnd", "updated_at"])
    return variant
