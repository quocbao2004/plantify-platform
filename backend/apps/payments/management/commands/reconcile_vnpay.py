from ipaddress import ip_address

from django.core.management.base import BaseCommand, CommandError

from apps.payments.models import Transaction
from apps.payments.providers.vnpay import vnpay_enabled
from apps.payments.services.vnpay_reconciliation import query_vnpay, reconcile_result


class Command(BaseCommand):
    help = "Reconcile a pending VNPay payment by transaction reference."

    def add_arguments(self, parser):
        parser.add_argument("reference")
        parser.add_argument("--server-ip", required=True, type=ip_address)

    def handle(self, *args, **options):
        if not vnpay_enabled():
            raise CommandError("VNPay is not configured.")
        payment = Transaction.objects.filter(
            transaction_code=options["reference"],
            payment_method=Transaction.PaymentMethod.VNPAY,
            transaction_type=Transaction.TransactionType.PURCHASE,
            status=Transaction.TransactionStatus.PENDING,
            purchase_order__checkout_key__isnull=False,
        ).first()
        if payment is None:
            raise CommandError("Pending VNPay payment was not found.")
        try:
            response = query_vnpay(payment, str(options["server_ip"]))
        except (OSError, ValueError) as exc:
            raise CommandError("VNPay QueryDR request failed.") from exc
        code = reconcile_result(payment, response)
        if code not in {"00", "02"}:
            raise CommandError(f"VNPay payment was not finalized (code {code}).")
        payment.refresh_from_db(fields=["status"])
        self.stdout.write(f"{payment.transaction_code}: {payment.status}")
