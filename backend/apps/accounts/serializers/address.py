from rest_framework import serializers
from apps.accounts.models import UserAddress


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            "id",
            "recipient_name",
            "phone",
            "address_line",
            "ward",
            "district",
            "province",
            "postal_code",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
