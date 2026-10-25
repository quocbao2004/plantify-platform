from apps.accounts.models import User
from apps.recommendations.models.activity_event import UserActivityEvent


def track_user_activity(
    *,
    user: User = None,
    anonymous_session_id=None,
    product_id: str = None,
    event_type: str,
    search_query: str = "",
) -> UserActivityEvent:
    return UserActivityEvent.objects.create(
        user=user,
        anonymous_session_id=anonymous_session_id,
        product_id=product_id,
        event_type=event_type,
        search_query=search_query,
    )
