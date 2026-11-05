from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

from apps.accounts.models import User


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    full_name = serializers.CharField(min_length=2, max_length=255)
    phone = serializers.RegexField(
        r"^(?:0[35789]\d{8}|\+?84[35789]\d{8})$",
        max_length=20,
        required=False,
        allow_blank=True,
        error_messages={"invalid": "Số điện thoại Việt Nam không hợp lệ."},
    )

    def validate(self, attrs):
        user = User(email=attrs["email"], full_name=attrs["full_name"])
        try:
            validate_password(attrs["password"], user=user)
        except ValidationError as exc:
            raise serializers.ValidationError({"password": exc.messages}) from exc
        return attrs


class SocialAuthInterfaceSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=["GOOGLE", "FACEBOOK"])
    access_token = serializers.CharField(required=False, allow_blank=True)
    id_token = serializers.CharField(required=False, allow_blank=True)
    auth_token = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        token = (
            attrs.get("access_token")
            or attrs.get("id_token")
            or attrs.get("auth_token")
            or attrs.get("code")
        )
        if not token:
            raise serializers.ValidationError(
                "Yêu cầu access_token, id_token, auth_token hoặc code để xác thực."
            )
        return attrs
