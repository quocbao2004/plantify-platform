import hmac
import json
from urllib.request import Request, urlopen
from uuid import uuid4

from django.conf import settings
from django.utils import timezone

from apps.payments.models import Transaction
from apps.payments.providers.vnpay import PAYMENT_WINDOW, sign_vnpay, vnpay_date
from apps.payments.services.vnpay import record_vnpay_result

REQUEST_FIELDS = (
    "vnp_RequestId", "vnp_Version", "vnp_Command", "vnp_TmnCode", "vnp_TxnRef",
    "vnp_TransactionDate", "vnp_CreateDate", "vnp_IpAddr", "vnp_OrderInfo",
)
RESPONSE_FIELDS = (
    "vnp_ResponseId", "vnp_Command", "vnp_ResponseCode", "vnp_Message", "vnp_TmnCode",
    "vnp_TxnRef", "vnp_Amount", "vnp_BankCode", "vnp_PayDate", "vnp_TransactionNo",
    "vnp_TransactionType", "vnp_TransactionStatus", "vnp_OrderInfo", "vnp_PromotionCode",
    "vnp_PromotionAmount",
)


def query_vnpay(payment, ip_address):
    payload = {
        "vnp_RequestId": uuid4().hex,
        "vnp_Version": "2.1.0",
        "vnp_Command": "querydr",
        "vnp_TmnCode": settings.VNPAY_TMN_CODE,
        "vnp_TxnRef": payment.transaction_code,
        "vnp_TransactionDate": vnpay_date(payment.transaction_date),
        "vnp_CreateDate": vnpay_date(timezone.now()),
        "vnp_IpAddr": ip_address,
        "vnp_OrderInfo": f"Truy van giao dich {payment.transaction_code}",
    }
    payload["vnp_SecureHash"] = sign_vnpay("|".join(payload[field] for field in REQUEST_FIELDS))
    request = Request(
        settings.VNPAY_QUERY_URL, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "Accept": "application/json"}, method="POST",
    )
    with urlopen(request, timeout=10) as response:
        return json.loads(response.read(65537))


def reconcile_result(payment, data):
    if not isinstance(data, dict):
        return "97"
    signature = data.get("vnp_SecureHash", "")
    signed = "|".join(str(data[field]) if data.get(field) is not None else "" for field in RESPONSE_FIELDS)
    if not isinstance(signature, str) or not signature.isascii() or not hmac.compare_digest(sign_vnpay(signed), signature.lower()):
        return "97"
    if (
        data.get("vnp_Command") != "querydr"
        or data.get("vnp_TmnCode") != settings.VNPAY_TMN_CODE
        or data.get("vnp_TxnRef") != payment.transaction_code
    ):
        return "97"

    response_code = data.get("vnp_ResponseCode")
    gateway_state = data.get("vnp_TransactionStatus")
    expired = payment.transaction_date + PAYMENT_WINDOW <= timezone.now()
    if response_code == "91" and expired:
        return record_vnpay_result(payment.transaction_code, None, Transaction.TransactionStatus.CANCELLED, data)
    if response_code != "00":
        return "99"

    statuses = {"00": Transaction.TransactionStatus.SUCCESS, "02": Transaction.TransactionStatus.FAILED}
    return record_vnpay_result(
        payment.transaction_code, str(data.get("vnp_Amount", "")), statuses.get(gateway_state), data,
    )
