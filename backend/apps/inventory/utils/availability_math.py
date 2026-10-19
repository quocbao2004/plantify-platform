def calculate_available_sale_stock(quantity_on_hand: int, quantity_reserved: int) -> int:
    """Calculate instantly purchasable inventory count."""
    return max(0, quantity_on_hand - quantity_reserved)
