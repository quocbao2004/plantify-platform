import hmac
import hashlib


def verify_hmac_sha256_signature(secret_key: str, data: str, expected_signature: str) -> bool:
    """Verify webhook cryptographic checksum signature."""
    if not secret_key or not expected_signature:
        return False
    computed = hmac.new(secret_key.encode("utf-8"), data.encode("utf-8"), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed.lower(), expected_signature.lower())
