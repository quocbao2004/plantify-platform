import uuid
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.catalog.models import PlantAsset
from apps.catalog.serializers import (
    PlantAssetSerializer,
    BatchGenerateAssetsSerializer,
)


class PlantAssetListView(generics.ListCreateAPIView):
    """
    API danh sách cây cảnh định danh (Plant Assets) có mã định danh và QR code.
    Hỗ trợ tìm kiếm, lọc theo cây cảnh, kích cỡ, trạng thái.
    """
    serializer_class = PlantAssetSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = PlantAsset.objects.select_related(
            "plant_detail__plant",
            "plant_detail"
        ).prefetch_related("plant_detail__media")

        # Filter theo plant ID
        plant_id = self.request.query_params.get("plant_id", "").strip()
        if plant_id:
            try:
                plant_uuid = uuid.UUID(plant_id)
                queryset = queryset.filter(plant_detail__plant_id=plant_uuid)
            except ValueError:
                pass

        # Filter theo plant_detail ID (SKU)
        detail_id = self.request.query_params.get("detail_id", "").strip()
        if detail_id:
            try:
                detail_uuid = uuid.UUID(detail_id)
                queryset = queryset.filter(plant_detail_id=detail_uuid)
            except ValueError:
                pass

        # Filter theo status
        asset_status = self.request.query_params.get("status", "").strip()
        if asset_status and asset_status.upper() != "ALL":
            queryset = queryset.filter(status=asset_status.upper())

        # Filter theo health condition
        health = self.request.query_params.get("health", "").strip()
        if health and health.upper() != "ALL":
            queryset = queryset.filter(health_condition=health.upper())

        # Tìm kiếm theo asset_code, tên cây, vị trí, ghi chú
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(asset_code__icontains=search)
                | Q(plant_detail__plant__name__icontains=search)
                | Q(current_location__icontains=search)
                | Q(notes__icontains=search)
            )

        return queryset


class PlantAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API xem chi tiết, cập nhật hoặc xóa một cây cảnh định danh cụ thể.
    Tra cứu được bằng cả UUID `pk` hoặc mã định danh `asset_code`.
    Dùng cho cả Admin lẫn trang Quét mã QR công khai của User.
    """
    serializer_class = PlantAssetSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        lookup = self.kwargs.get("pk") or self.kwargs.get("asset_code")
        queryset = PlantAsset.objects.select_related(
            "plant_detail__plant",
            "plant_detail"
        ).prefetch_related("plant_detail__media")

        try:
            lookup_uuid = uuid.UUID(str(lookup))
            return generics.get_object_or_404(queryset, id=lookup_uuid)
        except (ValueError, TypeError):
            return generics.get_object_or_404(queryset, asset_code__iexact=str(lookup).strip())


class PlantAssetBatchGenerateView(APIView):
    """
    API sinh hàng loạt mã số riêng cho cây cảnh khi nhập kho số lượng nhiều.
    Ví dụ: nhập 20 cây Kim Tiền ➔ tự sinh KT-0001 đến KT-0020.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = BatchGenerateAssetsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        created_assets = serializer.save()
        response_serializer = PlantAssetSerializer(created_assets, many=True)
        return Response(
            {
                "success": True,
                "message": f"Đã sinh thành công {len(created_assets)} mã số cây cảnh riêng biệt.",
                "count": len(created_assets),
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
