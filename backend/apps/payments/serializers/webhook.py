from rest_framework import serializers


class WebhookPayloadSerializer(serializers.Serializer):
    provider = serializers.CharField()
    provider_transaction_id = serializers.CharField()
    amount_vnd = serializers.IntegerField()
    signature = serializers.CharField()
    payload = serializers.DictField()
