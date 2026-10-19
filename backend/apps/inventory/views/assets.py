from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from apps.inventory.models.plant_asset import PlantAsset
from apps.inventory.serializers.asset import PlantAssetSerializer
from apps.inventory.permissions.inventory import IsStaffForInventory


class PlantAssetListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffForInventory]
    serializer_class = PlantAssetSerializer
    queryset = PlantAsset.objects.select_related("variant__product").order_by("asset_code")
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["variant", "condition", "status"]


class PlantAssetDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsStaffForInventory]
    serializer_class = PlantAssetSerializer
    queryset = PlantAsset.objects.select_related("variant__product")
    lookup_field = "id"
