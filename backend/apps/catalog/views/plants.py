import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import Q, Count
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from apps.catalog.models import Category, Plants, PlantsDetail
from apps.catalog.serializers import (
    CategorySerializer,
    PlantsSerializer,
    PlantsDetailSerializer,
)


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        is_active_param = self.request.query_params.get("is_active", "").strip().lower()
        if is_active_param in ("all", "any") or (self.request.user and self.request.user.is_staff):
            queryset = Category.objects.all()
        else:
            queryset = Category.objects.filter(is_active=True)
        return queryset.annotate(plants_count_annotated=Count("plants"))


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().annotate(plants_count_annotated=Count("plants"))
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        is_active_param = self.request.query_params.get("is_active", "").strip().lower()
        if is_active_param in ("true", "1"):
            queryset = Plants.objects.filter(is_active=True)
        elif is_active_param in ("false", "0"):
            queryset = Plants.objects.filter(is_active=False)
        elif is_active_param in ("all", "any") or (self.request.user and self.request.user.is_staff):
            queryset = Plants.objects.all()
        else:
            # Default for storefront
            queryset = Plants.objects.filter(is_active=True)

        queryset = queryset.select_related("category").prefetch_related("details__media")

        # Search filter
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(slug__icontains=search)
                | Q(category__name__icontains=search)
            )

        # Category filter
        category = self.request.query_params.get("category", "").strip()
        if category and category.upper() != "ALL":
            try:
                cat_uuid = uuid.UUID(category)
                queryset = queryset.filter(category__id=cat_uuid)
            except ValueError:
                queryset = queryset.filter(category__slug=category)

        # Ordering
        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset


class PlantsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plants.objects.all().select_related("category").prefetch_related("details__media")
    serializer_class = PlantsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg) or self.kwargs.get("pk") or self.kwargs.get("slug")
        try:
            val_uuid = uuid.UUID(str(val))
            return generics.get_object_or_404(queryset, id=val_uuid)
        except (ValueError, TypeError):
            return generics.get_object_or_404(queryset, slug=val)


class PlantsDetailItemListCreateView(generics.ListCreateAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]


class PlantsDetailItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlantsDetail.objects.all().select_related("plant").prefetch_related("media")
    serializer_class = PlantsDetailSerializer
    permission_classes = [permissions.AllowAny]


class ImageUploadView(APIView):
    """
    API tải lên hình ảnh cho cây cảnh / sản phẩm.
    Hỗ trợ multipart/form-data với field 'file' hoặc 'image'.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

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

