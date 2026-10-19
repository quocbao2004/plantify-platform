from apps.payments.providers.base import BasePaymentProvider
from apps.common.exceptions import BusinessRuleError


class VNPayProvider(BasePaymentProvider):
    def create_payment_url(self, *, order_code: str, amount_vnd: int, return_url: str) -> str:
        raise BusinessRuleError("Cổng VNPAY đang ở dạng scaffold interface, cần cung cấp VNPAY_TMN_CODE và HASH_SECRET.")

    def verify_webhook_signature(self, payload: dict, signature: str) -> bool:
        return False


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
