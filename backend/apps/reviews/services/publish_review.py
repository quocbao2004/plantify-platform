from django.db import transaction
from apps.accounts.models import User
from apps.orders.models.order_item import OrderItem
from apps.orders.constants.choices import OrderStatus
from apps.reviews.models.review import ProductReview
from apps.reviews.constants.choices import ReviewStatus
from apps.common.exceptions import BusinessRuleError, ConflictError


@transaction.atomic
def submit_product_review(
    user: User,
    *,
    order_item_id: str,
    rating: int,
    comment: str,
) -> ProductReview:
    if not (1 <= rating <= 5):
        raise BusinessRuleError("Điểm đánh giá phải từ 1 đến 5 sao.")

    try:
        order_item = OrderItem.objects.select_related("order", "variant__product").get(id=order_item_id, order__user=user)
    except OrderItem.DoesNotExist:
        raise BusinessRuleError("Không tìm thấy sản phẩm trong lịch sử đơn hàng của bạn.")

    if order_item.order.status not in [OrderStatus.DELIVERED, OrderStatus.COMPLETED]:
        raise BusinessRuleError("Bạn chỉ có thể đánh giá sau khi đơn hàng đã được giao hoặc hoàn thành.")

    if ProductReview.objects.filter(user=user, order_item=order_item).exists():
        raise ConflictError("Bạn đã gửi đánh giá cho sản phẩm này rồi.")

    review = ProductReview.objects.create(
        user=user,
        product=order_item.variant.product,
        order_item=order_item,
        rating=rating,
        comment=comment,
        status=ReviewStatus.PUBLISHED,
    )
    return review
