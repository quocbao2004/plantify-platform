from rest_framework import serializers
from apps.cms.models.banner import Banner


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "image", "link_url", "position", "sort_order", "is_active"]
