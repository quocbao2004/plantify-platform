def calculate_points_from_spend(spend_vnd: int, rate: int = 1000) -> int:
    """Default: 1 point earned for every 10,000 VND spent."""
    return max(0, int(spend_vnd) // 10000)
