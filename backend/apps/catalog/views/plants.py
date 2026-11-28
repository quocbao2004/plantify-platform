import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import Count, Q, Sum
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from apps.catalog.models import Category, Plants, PlantsDetail
from apps.catalog.permissions import IsStaffOrReadOnly
from apps.catalog.serializers import (
    CategorySerializer,
    PlantsSerializer,
    PlantsDetailSerializer,
)
from apps.orders.models import PurchaseOrder


def plant_queryset():
    return Plants.objects.select_related("category").prefetch_related("details__media", "details__assets")


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        is_active_param = self.request.query_params.get("is_active", "").strip().lower()
        if self.request.user.is_staff and is_active_param not in ("true", "1"):
            queryset = Category.objects.all()
        else:
            queryset = Category.objects.filter(is_active=True)
        return queryset.annotate(plants_count_annotated=Count("plants"))


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().annotate(plants_count_annotated=Count("plants"))
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        plants_count = instance.plants.count()
        if plants_count > 0:
            return Response(
                {
                    "success": False,
                    "message": f"Không thể xóa danh mục \"{instance.name}\" vì đang có {plants_count} cây cảnh liên kết. Vui lòng chuyển các cây này sang danh mục khác hoặc xóa cây trước.",
                    "code": "CATEGORY_HAS_PLANTS",
                    "plants_count": plants_count,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class PlantsListCreateView(generics.ListCreateAPIView):
    serializer_class = PlantsSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["care_level", "light_requirement"]

    def get_queryset(self):
        params = self.request.query_params
        is_active_param = params.get("is_active", "").strip().lower()
        queryset = plant_queryset()
        if not self.request.user.is_staff or is_active_param in ("true", "1"):
            queryset = queryset.filter(is_active=True, category__is_active=True)
        elif is_active_param in ("false", "0"):
            queryset = queryset.filter(is_active=False)

        # Search filter
        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(slug__icontains=search)
                | Q(category__name__icontains=search)
            )

        # Category filter
        category = params.get("category", "").strip()
        if category and category.upper() != "ALL":
            category_filter = Q(category__slug=category) | Q(category__name__iexact=category)
            try:
                category_filter |= Q(category_id=uuid.UUID(category))
            except ValueError:
                pass
            queryset = queryset.filter(category_filter)

        if params.get("sort_by") == "popular":
            order_status = PurchaseOrder.OrderStatus
            purchased = Q(details__purchase_order_details__purchase_order__status__in=[
                order_status.PAID, order_status.PROCESSING, order_status.DELIVERING, order_status.COMPLETED,
            ])
            return queryset.annotate(
                units_sold=Sum("details__purchase_order_details__quantity", filter=purchased, default=0),
            ).order_by("-units_sold", "-created_at", "id")

        # Ordering
        ordering = params.get("ordering", "-created_at")
        if ordering.lstrip("-") not in {"created_at", "updated_at", "name", "slug"}:
            ordering = "-created_at"
        return queryset.order_by(ordering, "id")


class PlantsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = plant_queryset()
    serializer_class = PlantsSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True, category__is_active=True)
        return queryset

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        val = self.kwargs["pk"]
        try:
            val_uuid = uuid.UUID(str(val))
        except ValueError:
            obj = generics.get_object_or_404(queryset, slug=val)
        else:
            obj = generics.get_object_or_404(queryset, id=val_uuid)
        self.check_object_permissions(self.request, obj)
        return obj


class PlantsBySlugView(generics.RetrieveAPIView):
    queryset = plant_queryset().filter(is_active=True, category__is_active=True)
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class PlantsDetailItemListCreateView(generics.ListCreateAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [IsStaffOrReadOnly]


class PlantsDetailItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [IsStaffOrReadOnly]


class ImageUploadView(APIView):
    """
    API tải lên hình ảnh cho cây cảnh / sản phẩm.
    Hỗ trợ multipart/form-data với field 'file' hoặc 'image'.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsStaffOrReadOnly]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file") or request.FILES.get("image")
        if not file_obj:
            return Response(
                {"error": "Không tìm thấy file hình ảnh tải lên (field 'file' hoặc 'image')."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate extension
        ext = os.path.splitext(file_obj.name)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]:
            return Response(
                {"error": "Định dạng file không được hỗ trợ. Vui lòng tải lên ảnh JPG, PNG, WEBP, GIF hoặc SVG."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Giới hạn kích thước file: 10MB
        if file_obj.size > 10 * 1024 * 1024:
            return Response(
                {"error": "Dung lượng ảnh vượt quá giới hạn 10MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lưu file với tên ngẫu nhiên tránh trùng
        unique_filename = f"plants/{uuid.uuid4().hex}{ext}"
        saved_name = default_storage.save(unique_filename, ContentFile(file_obj.read()))
        relative_url = f"{settings.MEDIA_URL}{saved_name}"
        full_url = request.build_absolute_uri(relative_url)

        return Response(
            {
                "success": True,
                "url": full_url,
                "relative_url": relative_url,
                "filename": file_obj.name,
            },
            status=status.HTTP_201_CREATED,
        )

