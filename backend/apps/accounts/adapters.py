from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from apps.accounts.utils.normalize_email import normalize_email_address


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter for social account logins.
    Populates full_name from OAuth provider data and connects existing accounts with same email.
    """

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)

        if user.email:
            user.email = normalize_email_address(user.email)

        name = (
            data.get("name")
            or f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            or (user.email.split("@")[0] if user.email else "Người dùng")
        )

        if not getattr(user, "full_name", None) or not user.full_name.strip():
            user.full_name = name

        return user

    def pre_social_login(self, request, sociallogin):
        """
        Connect existing account with the same email address if already registered,
        enabling seamless social sign-in.
        """
        from apps.accounts.models import User

        if sociallogin.is_existing:
            return

        email = sociallogin.account.extra_data.get("email")
        if not email:
            return

        normalized_email = normalize_email_address(email)
        try:
            existing_user = User.objects.get(email=normalized_email)
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            pass
