from django.urls import path
from apps.reviews.views.reviews import ProductReviewsView, ReviewDetailView

app_name = "reviews"

urlpatterns = [
    path("products/<uuid:product_id>/", ProductReviewsView.as_view(), name="product-reviews"),
    path("<uuid:id>/", ReviewDetailView.as_view(), name="review-detail"),
]
