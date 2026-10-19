from abc import ABC, abstractmethod


class BasePaymentProvider(ABC):
    """Abstract interface adapter for third-party payment gateways."""

    @abstractmethod
    def create_payment_url(self, *, order_code: str, amount_vnd: int, return_url: str) -> str:
        pass

    @abstractmethod
    def verify_webhook_signature(self, payload: dict, signature: str) -> bool:
        pass
