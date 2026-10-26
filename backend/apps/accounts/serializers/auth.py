from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)


class SocialAuthInterfaceSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=["GOOGLE", "FACEBOOK"])
    auth_token = serializers.CharField(write_only=True)

