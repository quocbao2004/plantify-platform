from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.catalog.serializers.product_read import ProductListSerializer
from apps.recommendations.services.recommend_products import recommend_for_user, recommend_similar_products


class RecommendForMeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = recommend_for_user(request.user)
        return Response({"success": True, "data": ProductListSerializer(products, many=True).data})


class SimilarProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        products = recommend_similar_products(str(id))
        return Response({"success": True, "data": ProductListSerializer(products, many=True).data})
