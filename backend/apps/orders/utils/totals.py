def calculate_order_payable_total(
    subtotal_sale_vnd: int,
    subtotal_rent_vnd: int,
    deposit_total_vnd: int,
    shipping_fee_vnd: int,
    discount_total_vnd: int,
) -> int:
    """Calculate final payable VND amount strictly without floats."""
    total = (
        int(subtotal_sale_vnd)
        + int(subtotal_rent_vnd)
        + int(deposit_total_vnd)
        + int(shipping_fee_vnd)
        - int(discount_total_vnd)
    )
    return max(0, total)
