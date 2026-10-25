EVENT_WEIGHTS = {
    "VIEW": 1,
    "SEARCH": 2,
    "WISHLIST": 3,
    "ADD_TO_CART": 5,
    "PURCHASE": 10,
    "RENT": 10,
}


def score_event_type(event_type: str) -> int:
    return EVENT_WEIGHTS.get(event_type, 1)
