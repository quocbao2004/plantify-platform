from rest_framework import serializers
from apps.accounts.models import Staff
from .user import UserSerializer


class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Staff
        fields = [
            "id",
            "user",
            "staff_code",
            "department",
            "position",
            "is_available",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
