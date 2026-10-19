from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from apps.orders.models.shipment import Shipment
from apps.orders.serializers.shipment import ShipmentSerializer


class ShipmentListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ShipmentSerializer
    queryset = Shipment.objects.all().order_by("-created_at")
