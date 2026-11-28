from decimal import Decimal
from uuid import uuid4

from django.conf import settings
from django.db import transaction

from apps.catalog.models import PlantsDetail
from apps.orders.models import PurchaseOrder, PurchaseOrderDetail
from apps.payments.models import Transaction
from apps.payments.providers.vnpay import vnpay_amount, vnpay_enabled
from config.exceptions import BusinessRuleError, ConflictError


def load_variants(items, *, lock=False):
    variants = PlantsDetail.objects.filter(pk__in=[item["plant_detail"] for item in items])
    variants = variants.select_related("plant__category").order_by("pk")
    if lock:
        variants = variants.select_for_update(of=("self",))
    return {variant.pk: variant for variant in variants}


def get_sale_price(variant):
    if (
        variant is None
        or not variant.plant.is_active
        or not variant.plant.category.is_active
        or variant.status != PlantsDetail.PlantStatus.AVAILABLE
        or variant.sale_price <= 0
    ):
        return None
    return variant.sale_price


def shipping_fee():
    return Decimal(settings.CHECKOUT_SHIPPING_FEE_VND).quantize(Decimal("0.01"))


def quote_cart(items):
    variants = load_variants(items)
    lines = []
    subtotal = Decimal("0.00")
    for item in items:
        variant = variants.get(item["plant_detail"])
        price = get_sale_price(variant)
        quantity = item["quantity"]
        line_total = price * quantity if price is not None else Decimal("0.00")
        subtotal += line_total
        lines.append({
            "plant_detail": item["plant_detail"],
            "quantity": quantity,
            "name": variant.plant.name if price is not None else None,
            "slug": variant.plant.slug if price is not None else None,
            "size": variant.size if price is not None else "",
            "unit_price": str(price) if price is not None else None,
            "line_total": str(line_total),
            "available_quantity": variant.stock_quantity if price is not None else 0,
        })
    fee = shipping_fee()
    return {
        "items": lines, "subtotal": str(subtotal), "shipping_fee": str(fee),
        "total": str(subtotal + fee), "vnpay_enabled": vnpay_enabled(),
    }


@transaction.atomic
def place_order(user, *, items, checkout_key, shipping_fee_confirmed, payment_method, **delivery):
    # A user's retries serialize before we lock stock rows in primary-key order.
    type(user).objects.select_for_update().only("pk").get(pk=user.pk)
    existing_order = PurchaseOrder.objects.filter(user=user, checkout_key=checkout_key).first()
    if existing_order is not None:
        return existing_order, False
    online = payment_method == Transaction.PaymentMethod.VNPAY
    if online and not vnpay_enabled():
        raise BusinessRuleError("VNPay chưa được cấu hình.")

    fee = shipping_fee()
    if fee != shipping_fee_confirmed:
        raise ConflictError("Phí giao hàng đã thay đổi. Hãy kiểm tra lại đơn hàng.")

    variants = load_variants(items, lock=True)
    details = []
    total = fee
    for item in items:
        variant = variants.get(item["plant_detail"])
        price = get_sale_price(variant)
        quantity = item["quantity"]
        if price is None or quantity > variant.stock_quantity:
            raise ConflictError("Số lượng có thể mua đã thay đổi. Hãy kiểm tra lại giỏ hàng.")
        if price != item["unit_price"]:
            raise ConflictError("Giá cây đã thay đổi. Hãy kiểm tra và xác nhận lại đơn hàng.")

        line_total = price * quantity
        total += line_total
        variant.stock_quantity -= quantity
        details.append(PurchaseOrderDetail(
            plant_detail=variant, quantity=quantity, unit_price=price, total_price=line_total,
        ))

    if total >= Decimal("1000000000000"):
        raise BusinessRuleError("Tổng tiền vượt quá giới hạn cho một đơn hàng.")
    if online and (total != total.to_integral_value() or vnpay_amount(total) > 999999999999):
        raise BusinessRuleError("Tổng tiền không nằm trong giới hạn thanh toán VNPay.")

    order = PurchaseOrder.objects.create(
        user=user, checkout_key=checkout_key, order_code=f"PL-{uuid4().hex.upper()}",
        total_amount=total, shipping_fee=fee, **delivery,
    )
    for detail in details:
        detail.purchase_order = order
    PurchaseOrderDetail.objects.bulk_create(details)
    PlantsDetail.objects.bulk_update(list(variants.values()), ["stock_quantity"])
    Transaction.objects.create(
        user=user, purchase_order=order, transaction_code=uuid4().hex.upper() if online else order.order_code,
        amount=total, payment_method=payment_method,
    )
    return order, True


def restore_stock(order):
    items = list(order.details.values("plant_detail", "quantity"))
    variants = load_variants(items, lock=True)
    for item in items:
        variants[item["plant_detail"]].stock_quantity += item["quantity"]
    PlantsDetail.objects.bulk_update(list(variants.values()), ["stock_quantity"])


@transaction.atomic
def update_order_status(order_id, new_status):
    order = PurchaseOrder.objects.select_for_update().get(pk=order_id, checkout_key__isnull=False)
    status = PurchaseOrder.OrderStatus
    payment = order.transactions.get(transaction_type=Transaction.TransactionType.PURCHASE)
    is_cod = payment.payment_method == Transaction.PaymentMethod.CASH
    if not is_cod and (payment.status != Transaction.TransactionStatus.SUCCESS or new_status == status.CANCELLED):
        return False

    allowed = {
        status.PENDING: (status.PROCESSING, status.CANCELLED),
        status.PAID: (status.PROCESSING,),
        status.PROCESSING: (status.DELIVERING, status.CANCELLED),
        status.DELIVERING: (status.COMPLETED, status.CANCELLED),
    }
    if new_status not in allowed.get(order.status, ()):
        return False

    if new_status == status.CANCELLED:
        from apps.orders.services.shipment import cancel_shipments_for_purchase_order

        restore_stock(order)
        payment.status = Transaction.TransactionStatus.CANCELLED
        payment.save(update_fields=["status", "updated_at"])
        cancel_shipments_for_purchase_order(order)
    elif new_status == status.DELIVERING:
        from apps.orders.services.shipment import ensure_shipment_for_purchase_order

        ensure_shipment_for_purchase_order(order)
    elif new_status == status.COMPLETED:
        from apps.orders.services.shipment import complete_shipments_for_purchase_order

        if is_cod:
            payment.status = Transaction.TransactionStatus.SUCCESS
            payment.save(update_fields=["status", "updated_at"])
        complete_shipments_for_purchase_order(order)

    order.status = new_status
    order.save(update_fields=["status", "updated_at"])
    return True
