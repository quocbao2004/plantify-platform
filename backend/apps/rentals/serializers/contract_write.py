from rest_framework import serializers


class AllocateAssetSerializer(serializers.Serializer):
    plant_asset_id = serializers.UUIDField()
