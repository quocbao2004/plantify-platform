from rest_framework import serializers
from apps.catalog.serializers.product_read import ProductListSerializer


class RecommendationResultSerializer(serializers.Serializer):
    strategy = serializers.CharField()
    products = ProductListSerializer(many=True)
