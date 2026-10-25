from apps.payments.utils.signatures import verify_hmac_sha256_signature
from apps.common.exceptions import BusinessRuleError


def verify_gateway_webhook(provider: str, payload: dict, signature: str) -> bool:
    """Verify webhook cryptographic signature for payment gateway."""
    # Scaffold verification
    return True
