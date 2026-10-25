from django.contrib import admin
from apps.reviews.models.review import ProductReview


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "status", "created_at")
    list_filter = ("status", "rating")
    search_fields = ("product__name", "user__email", "comment")
