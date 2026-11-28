import hashlib
import hmac
from datetime import timedelta, timezone as datetime_timezone
from urllib.parse import urlencode

from django.conf import settings
from django.utils import timezone

from apps.payments.providers.base import BasePaymentProvider
from config.exceptions import BusinessRuleError

PAYMENT_WINDOW = timedelta(minutes=15)
VNPAY_TIMEZONE = datetime_timezone(timedelta(hours=7))


def vnpay_enabled():
    return all((
        settings.VNPAY_TMN_CODE,
        settings.VNPAY_HASH_SECRET,
        settings.VNPAY_PAYMENT_URL,
        settings.VNPAY_RETURN_URL,
        settings.VNPAY_ORDERS_URL,
    ))


def sign_vnpay(data):
    return hmac.new(settings.VNPAY_HASH_SECRET.encode(), data.encode(), hashlib.sha512).hexdigest()


def vnpay_amount(amount):
    return int(amount * 100)


def vnpay_date(value):
    return value.astimezone(VNPAY_TIMEZONE).strftime("%Y%m%d%H%M%S")


def encode_payment_params(payload):
    return urlencode(sorted(
        (key, value) for key, value in payload.items()
        if key.startswith("vnp_") and key not in {"vnp_SecureHash", "vnp_SecureHashType"} and value != ""
    ))


class VNPayProvider(BasePaymentProvider):
    def create_payment_url(self, *, order_code, amount_vnd, return_url, ip_address="127.0.0.1", created_at=None):
        if not vnpay_enabled():
            raise BusinessRuleError("VNPay chưa được cấu hình.")
        created_at = created_at or timezone.now()
        query = encode_payment_params({
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": settings.VNPAY_TMN_CODE,
            "vnp_Amount": vnpay_amount(amount_vnd),
            "vnp_CurrCode": "VND",
            "vnp_IpAddr": ip_address,
            "vnp_Locale": "vn",
            "vnp_OrderInfo": f"Thanh toan don hang {order_code}",
            "vnp_OrderType": "other",
            "vnp_ReturnUrl": return_url,
            "vnp_TxnRef": order_code,
            "vnp_CreateDate": vnpay_date(created_at),
            "vnp_ExpireDate": vnpay_date(created_at + PAYMENT_WINDOW),
        })
        return f"{settings.VNPAY_PAYMENT_URL}?{query}&vnp_SecureHash={sign_vnpay(query)}"

    def verify_webhook_signature(self, payload: dict, signature: str) -> bool:
        if not settings.VNPAY_HASH_SECRET or not signature or not signature.isascii():
            return False
        return hmac.compare_digest(sign_vnpay(encode_payment_params(payload)), signature.lower())


class MoMoProvider(BasePaymentProvider):
    def create_payment_url(self, *, order_code: str, amount_vnd: int, return_url: str) -> str:
        raise BusinessRuleError("Ví MoMo đang ở dạng scaffold interface, cần cung cấp MOMO_PARTNER_CODE và ACCESS_KEY.")

    def verify_webhook_signature(self, payload: dict, signature: str) -> bool:
        return False


class ZaloPayProvider(BasePaymentProvider):
    def create_payment_url(self, *, order_code: str, amount_vnd: int, return_url: str) -> str:
        raise BusinessRuleError("Ví ZaloPay đang ở dạng scaffold interface, cần cấu hình APP_ID và KEY1.")

    def verify_webhook_signature(self, payload: dict, signature: str) -> bool:
        return False
