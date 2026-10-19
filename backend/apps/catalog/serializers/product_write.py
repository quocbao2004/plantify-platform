from rest_framework import serializers
from apps.catalog.models.product import Product


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "description",
            "care_instructions",
            "light_requirement",
            "care_level",
            "is_active",
        ]
        read_only_fields = ["id"]
