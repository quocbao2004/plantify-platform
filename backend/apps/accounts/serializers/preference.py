from rest_framework import serializers
from apps.accounts.models import UserPreference


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            "id",
            "budget_min_vnd",
            "budget_max_vnd",
            "preferred_light",
            "preferred_size",
            "care_experience",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]

    def validate(self, attrs):
        b_min = attrs.get("budget_min_vnd", getattr(self.instance, "budget_min_vnd", 0))
        b_max = attrs.get("budget_max_vnd", getattr(self.instance, "budget_max_vnd", 0))
        if b_min > 0 and b_max > 0 and b_min > b_max:
            raise serializers.ValidationError({"budget_min_vnd": "Ngân sách tối thiểu không thể lớn hơn tối đa."})
        return attrs
