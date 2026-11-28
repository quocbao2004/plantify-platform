from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.orders.models import PurchaseOrder
from apps.orders.services.checkout import restore_stock
from apps.payments.models import Transaction
from apps.payments.providers.vnpay import PAYMENT_WINDOW, VNPayProvider, vnpay_amount, vnpay_enabled


def purchase_payment(order):
    return next(
        (payment for payment in order.transactions.all() if payment.transaction_type == Transaction.TransactionType.PURCHASE),
        None,
    )


def payment_url(payment, ip_address):
    if (
        not vnpay_enabled()
        or not payment
        or payment.payment_method != Transaction.PaymentMethod.VNPAY
        or payment.status != Transaction.TransactionStatus.PENDING
        or payment.transaction_date + PAYMENT_WINDOW <= timezone.now()
    ):
        return None
    return VNPayProvider().create_payment_url(
        order_code=payment.transaction_code, amount_vnd=payment.amount,
        return_url=settings.VNPAY_RETURN_URL, ip_address=ip_address, created_at=payment.transaction_date,
    )


def valid_callback(payload):
    return (
        bool(settings.VNPAY_TMN_CODE)
        and payload.get("vnp_TmnCode") == settings.VNPAY_TMN_CODE
        and VNPayProvider().verify_webhook_signature(payload, payload.get("vnp_SecureHash", ""))
    )


@transaction.atomic
def record_vnpay_result(reference, amount, outcome, gateway_data):
    payment = Transaction.objects.filter(
        transaction_code=reference,
        payment_method=Transaction.PaymentMethod.VNPAY,
        transaction_type=Transaction.TransactionType.PURCHASE,
        purchase_order__checkout_key__isnull=False,
    ).first()
    if payment is None:
        return "01"
    if amount is not None and str(vnpay_amount(payment.amount)) != amount:
        return "04"

    # Fulfillment and payment both lock the order before changing related state.
    order = PurchaseOrder.objects.select_for_update().get(pk=payment.purchase_order_id)
    payment.refresh_from_db(fields=["status"])
    if payment.status != Transaction.TransactionStatus.PENDING:
        return "02"
    if order.status != PurchaseOrder.OrderStatus.PENDING or outcome is None:
        return "99"

    if outcome == Transaction.TransactionStatus.SUCCESS:
        order.status = PurchaseOrder.OrderStatus.PAID
    else:
        restore_stock(order)
        order.status = PurchaseOrder.OrderStatus.CANCELLED

    order.save(update_fields=["status", "updated_at"])
    payment.status = outcome
    payment.payment_gateway_response = {
        key: gateway_data[key] for key in ("vnp_ResponseCode", "vnp_TransactionStatus", "vnp_TransactionNo", "vnp_PayDate")
        if key in gateway_data
    }
    payment.save(update_fields=["status", "payment_gateway_response", "updated_at"])
    return "00"


def process_ipn(payload):
    if not valid_callback(payload):
        return "97"
    code = payload.get("vnp_ResponseCode")
    status = payload.get("vnp_TransactionStatus")
    outcome = None
    if code == status == "00":
        outcome = Transaction.TransactionStatus.SUCCESS
    elif code in {"11", "24"} and status in {"01", "02"}:
        outcome = Transaction.TransactionStatus.CANCELLED
    elif status == "02" and code and code not in {"00", "07"}:
        outcome = Transaction.TransactionStatus.FAILED
    return record_vnpay_result(payload.get("vnp_TxnRef", ""), payload.get("vnp_Amount", ""), outcome, payload)
