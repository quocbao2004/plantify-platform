from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from apps.accounts.models import User
from apps.accounts.utils.normalize_email import normalize_email_address
from config.exceptions import BusinessRuleError


def authenticate_user(*, email: str, password: str) -> tuple[User, dict[str, str]]:
    """
    Authenticate a user by email and raw password verified against password_hash.
    Returns (user, tokens_dict) where tokens has 'access' and 'refresh'.
    Raises AuthenticationFailed if credentials invalid or BusinessRuleError if account inactive.
    """
    normalized_email = normalize_email_address(email)
    try:
        user = User.objects.get(email=normalized_email)
    except User.DoesNotExist:
        raise AuthenticationFailed(
            detail="Email hoặc mật khẩu không chính xác.",
            code="INVALID_CREDENTIALS",
        )

    # Secure verification against password_hash (PBKDF2/Argon2/bcrypt)
    if not user.check_password(password):
        raise AuthenticationFailed(
            detail="Email hoặc mật khẩu không chính xác.",
            code="INVALID_CREDENTIALS",
        )

    if not user.is_active:
        raise BusinessRuleError(
            detail="Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt.",
            code="ACCOUNT_INACTIVE",
        )

    refresh = RefreshToken.for_user(user)
    tokens = {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
    return user, tokens
