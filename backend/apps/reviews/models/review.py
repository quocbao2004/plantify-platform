from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models.base import UUIDTimeStampedModel
from apps.catalog.models.product import Product
from apps.orders.models.order_item import OrderItem
from apps.reviews.constants.choices import ReviewStatus


class ProductReview(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Người đánh giá",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
        verbose_name="Sản phẩm cây cảnh",
    )
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.CASCADE,
        related_name="review",
        verbose_name="Mục đơn hàng đã mua/thuê",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Đánh giá sao (1-5)",
    )
    comment = models.TextField(verbose_name="Nội dung nhận xét")
    status = models.CharField(
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PUBLISHED,
        db_index=True,
    )

    class Meta:
        db_table = "reviews_product_reviews"
        unique_together = ("user", "order_item")
        verbose_name = "Đánh giá sản phẩm"
        verbose_name_plural = "Đánh giá sản phẩm"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"
