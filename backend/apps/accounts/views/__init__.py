from .auth import (
    LoginView,
    RegisterView,
    SocialAuthInterfaceView,
    GoogleLoginView,
)
from .profile import ProfileView, PreferenceView
from .addresses import AddressListView, AddressDetailView

__all__ = [
    "LoginView",
    "RegisterView",
    "SocialAuthInterfaceView",
    "GoogleLoginView",
    "ProfileView",
    "PreferenceView",
    "AddressListView",
    "AddressDetailView",
]
