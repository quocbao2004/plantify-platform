from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.accounts.views.auth import (
    LoginView,
    RegisterView,
    SocialAuthInterfaceView,
    GoogleLoginView,

)
from apps.accounts.views.profile import ProfileView, PreferenceView
from apps.accounts.views.addresses import AddressListView, AddressDetailView

app_name = "accounts"

urlpatterns = [
    # Auth Endpoints (JWT authentication)
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register-direct"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh-direct"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # Social OAuth Endpoints
    path("auth/social/", SocialAuthInterfaceView.as_view(), name="social-auth-interface"),
    path("auth/social/google/", GoogleLoginView.as_view(), name="social-google"),
    # Me / Profile
    path("me/", ProfileView.as_view(), name="profile"),
    path("me/addresses/", AddressListView.as_view(), name="address-list"),
    path("me/addresses/<uuid:id>/", AddressDetailView.as_view(), name="address-detail"),
    path("me/preferences/", PreferenceView.as_view(), name="preference"),
]
