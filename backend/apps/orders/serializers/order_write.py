from rest_framework import serializers
from apps.orders.models.order import Order


class OrderCancelSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True)
