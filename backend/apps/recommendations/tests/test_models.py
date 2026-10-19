import pytest
from apps.recommendations.models.activity_event import UserActivityEvent
from apps.recommendations.constants.choices import ActivityEventType


@pytest.mark.django_db
def test_track_activity_event():
    event = UserActivityEvent.objects.create(
        event_type=ActivityEventType.SEARCH,
        search_query="cây kim tiền",
    )
    assert event.event_type == ActivityEventType.SEARCH
    assert event.search_query == "cây kim tiền"
