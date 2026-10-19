from apps.common.exceptions import BusinessRuleError


def authenticate_social_identity(provider: str, auth_token: str):
    """
    Scaffold interface for OAuth identity verification.
    Requires external OAuth credentials and SDK to be configured before activation.
    """
    raise BusinessRuleError(
        f"Đăng nhập qua {provider} hiện đang ở chế độ giao diện scaffold. "
        "Cần cấu hình OAuth Client ID/Secret trước khi sử dụng."
    )
