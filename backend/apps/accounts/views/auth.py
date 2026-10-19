from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.serializers.auth import RegisterSerializer, SocialAuthInterfaceSerializer
from apps.accounts.serializers.user import UserSerializer
from apps.accounts.services.register_user import register_user
from apps.accounts.services.social_login import authenticate_social_identity


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = register_user(**serializer.validated_data)
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Đăng ký tài khoản thành công.",
                "data": {
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
            },
            status=status.HTTP_201_CREATED,
        )


class SocialAuthInterfaceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SocialAuthInterfaceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        authenticate_social_identity(
            provider=serializer.validated_data["provider"],
            auth_token=serializer.validated_data["auth_token"],
        )
        return Response({"success": True})
