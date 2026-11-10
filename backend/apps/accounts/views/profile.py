from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.serializers.user import UserSerializer
from apps.accounts.services.manage_profile import update_profile


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = update_profile(request.user, **request.data)
        serializer = UserSerializer(user)
        return Response(serializer.data)
