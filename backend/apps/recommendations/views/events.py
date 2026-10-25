from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.recommendations.serializers.events import UserActivityEventSerializer
from apps.recommendations.services.track_event import track_user_activity


class TrackEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserActivityEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user.is_authenticated else None
        event = track_user_activity(
            user=user,
            anonymous_session_id=serializer.validated_data.get("anonymous_session_id"),
            product_id=serializer.validated_data.get("product") and serializer.validated_data["product"].id,
            event_type=serializer.validated_data["event_type"],
            search_query=serializer.validated_data.get("search_query", ""),
        )
        return Response({"success": True, "data": UserActivityEventSerializer(event).data}, status=status.HTTP_201_CREATED)
