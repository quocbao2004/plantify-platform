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
