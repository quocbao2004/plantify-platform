from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.serializers.user import UserSerializer
from apps.accounts.serializers.preference import UserPreferenceSerializer
from apps.accounts.services.manage_profile import update_profile, update_user_preferences


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"success": True, "data": serializer.data})

    def patch(self, request):
        user = update_profile(
            request.user,
            full_name=request.data.get("full_name"),
            phone=request.data.get("phone"),
        )
        return Response({"success": True, "data": UserSerializer(user).data})


class PreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pref = getattr(request.user, "preference", None)
        serializer = UserPreferenceSerializer(pref) if pref else None
        return Response({"success": True, "data": serializer.data if serializer else None})

    def patch(self, request):
        serializer = UserPreferenceSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        pref = update_user_preferences(request.user, **serializer.validated_data)
        return Response({"success": True, "data": UserPreferenceSerializer(pref).data})
