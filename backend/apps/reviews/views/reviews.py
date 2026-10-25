from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.reviews.models.review import ProductReview
from apps.reviews.serializers.review import ProductReviewSerializer
from apps.reviews.selectors.reviews import get_product_published_reviews
from apps.reviews.services.publish_review import submit_product_review
from apps.reviews.permissions.reviews import IsReviewAuthorOrReadOnly
from apps.common.exceptions import ConflictError


class ProductReviewsView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, product_id):
        reviews = get_product_published_reviews(product_id)
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request, product_id):
        order_item_id = request.data.get("order_item_id")
        rating = int(request.data.get("rating", 5))
        comment = request.data.get("comment", "")

        review = submit_product_review(
            request.user,
            order_item_id=order_item_id,
            rating=rating,
            comment=comment,
        )
        return Response({"success": True, "data": ProductReviewSerializer(review).data}, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated, IsReviewAuthorOrReadOnly]

    def patch(self, request, id):
        try:
            review = ProductReview.objects.get(id=id)
        except ProductReview.DoesNotExist:
            raise ConflictError("Đánh giá không tồn tại.")

        self.check_object_permissions(request, review)
        if "comment" in request.data:
            review.comment = request.data["comment"]
        if "rating" in request.data:
            review.rating = int(request.data["rating"])
        review.save(update_fields=["comment", "rating", "updated_at"])

        return Response({"success": True, "data": ProductReviewSerializer(review).data})
