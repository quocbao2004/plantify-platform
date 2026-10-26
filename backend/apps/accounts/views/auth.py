from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from apps.accounts.serializers.auth import (
    LoginSerializer,
    RegisterSerializer,
    SocialAuthInterfaceSerializer,
)
from apps.accounts.serializers.user import UserSerializer
from apps.accounts.services.authenticate_user import authenticate_user
from apps.accounts.services.register_user import register_user


class LoginView(APIView):
    """
    Authenticate user using email and password, verifying against password_hash.
    Returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user, tokens = authenticate_user(**serializer.validated_data)
        user_data = UserSerializer(user).data

        return Response(
            {
                "success": True,
                "message": "Đăng nhập thành công.",
                "data": {
                    "user": user_data,
                    "tokens": tokens,
                },
                "user": user_data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = register_user(**serializer.validated_data)
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response(
            {
                "success": True,
                "message": "Đăng ký tài khoản thành công.",
                "data": {
                    "user": user_data,
                    "tokens": tokens,
                },
                "user": user_data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class BaseSocialLoginView(SocialLoginView):
    permission_classes = [AllowAny]

    def get_response(self):
        user = self.user
        user_data = UserSerializer(user).data
        refresh = RefreshToken.for_user(user)
        tokens = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
        return Response(
            {
                "success": True,
                "message": "Đăng nhập thành công.",
                "data": {
                    "user": user_data,
                    "tokens": tokens,
                },
                "user": user_data,
                "tokens": tokens,
                "access": tokens["access"],
                "refresh": tokens["refresh"],
            },
            status=status.HTTP_200_OK,
        )


class GoogleLoginView(BaseSocialLoginView):
    """
    Google OAuth2 login endpoint.
    Accepts access_token or id_token (from Google Identity Services).
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

def post(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        
        credential = data.get("credential") or data.get("auth_token") or data.get("token")
        if credential:
            data.setdefault("access_token", credential)
        if "id_token" in data and not data["id_token"]:
            data.pop("id_token", None)

        request._full_data = data
        print("Final Backend Data:", data)
        return super().post(request, *args, **kwargs)



class SocialAuthInterfaceView(APIView):
    """
    Unified Social Authentication endpoint.
    Accepts provider: 'GOOGLE' | 'FACEBOOK' and token payload.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SocialAuthInterfaceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.validated_data["provider"]

        if provider == "GOOGLE":
            return GoogleLoginView.as_view()(request._request, *args, **kwargs)
       

        return Response(
            {
                "success": False,
                "message": "Nhà cung cấp không hợp lệ. Vui lòng chọn GOOGLE hoặc FACEBOOK.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
