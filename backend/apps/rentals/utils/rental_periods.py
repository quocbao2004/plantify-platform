from datetime import datetime


def calculate_rental_duration_days(start_at: datetime, end_at: datetime) -> int:
    """Calculate inclusive duration in days between two datetimes."""
    if not start_at or not end_at or end_at <= start_at:
        return 0
    delta = end_at - start_at
    return max(1, delta.days)
