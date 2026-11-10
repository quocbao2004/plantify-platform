from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

from apps.accounts.models import User
from apps.accounts.constants import (
    PHONE_REGEX,
    PHONE_MAX_LENGTH,
    PHONE_REQUIRED_ERROR,
    PHONE_INVALID_ERROR,
    PHONE_ALREADY_EXISTS_ERROR,
)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    full_name = serializers.CharField(min_length=2, max_length=255)
    phone = serializers.RegexField(
        PHONE_REGEX,
        max_length=PHONE_MAX_LENGTH,
        required=True,
        allow_blank=False,
        error_messages={
            "required": PHONE_REQUIRED_ERROR,
            "blank": PHONE_REQUIRED_ERROR,
            "invalid": PHONE_INVALID_ERROR,
        },
    )

    def validate_phone(self, value):
        clean_phone = value.strip()
        if not clean_phone:
            raise serializers.ValidationError(PHONE_REQUIRED_ERROR)
        if User.objects.filter(phone=clean_phone).exists():
            raise serializers.ValidationError(PHONE_ALREADY_EXISTS_ERROR)
        return clean_phone

    def validate(self, attrs):
        user = User(email=attrs["email"], full_name=attrs["full_name"], phone=attrs.get("phone", ""))
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


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
