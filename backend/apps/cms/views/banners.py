from rest_framework import generics
from rest_framework.permissions import AllowAny
from apps.cms.models.banner import Banner
from apps.cms.serializers.banner import BannerSerializer


class BannerListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BannerSerializer
    pagination_class = None

    def get_queryset(self):
        pos = self.request.query_params.get("position")
        qs = Banner.objects.filter(is_active=True).order_by("sort_order")
        if pos:
            qs = qs.filter(position=pos)
        return qs
