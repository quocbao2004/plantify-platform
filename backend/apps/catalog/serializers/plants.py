import uuid
from rest_framework import serializers
from apps.catalog.models import Category, Plants, PlantsDetail, Media


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "is_active", "sort_order", "created_at", "updated_at"]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ["id", "plant_detail", "file_url", "media_type", "is_primary", "display_order", "created_at"]
        read_only_fields = ["id", "created_at"]


class PlantsDetailSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = PlantsDetail
        fields = [
            "id",
            "plant",
            "sku",
            "size",
            "height",
            "sale_price",
            "rental_price",
            "stock_quantity",
            "status",
            "description",
            "media",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PlantsSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)
    details = PlantsDetailSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    sale_price = serializers.SerializerMethodField()
    rental_price = serializers.SerializerMethodField()
    light_requirement = serializers.SerializerMethodField()
    care_level = serializers.SerializerMethodField()

    class Meta:
        model = Plants
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "slug",
            "description",
            "care_guide",
            "is_active",
            "details",
            "primary_image",
            "images",
            "sale_price",
            "rental_price",
            "light_requirement",
            "care_level",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]

    def get_primary_image(self, obj):
        details = getattr(obj, "details", None)
        if details:
            for detail in details.all():
                for m in detail.media.all():
                    if m.is_primary:
                        return m.file_url
                first_media = detail.media.first()
                if first_media:
                    return first_media.file_url
        return None

    def get_images(self, obj):
        imgs = []
        details = getattr(obj, "details", None)
        if details:
            for detail in details.all():
                for m in detail.media.all():
                    imgs.append({
                        "id": str(m.id),
                        "image": m.file_url,
                        "is_primary": m.is_primary,
                        "sort_order": m.display_order,
                    })
        return imgs

    def get_sale_price(self, obj):
        details = getattr(obj, "details", None)
        if details:
            prices = [d.sale_price for d in details.all() if d.sale_price is not None]
            if prices:
                return min(prices)
        return 0

    def get_rental_price(self, obj):
        details = getattr(obj, "details", None)
        if details:
            prices = [d.rental_price for d in details.all() if d.rental_price is not None]
            if prices:
                return min(prices)
        return 0

    def get_light_requirement(self, obj):
        return "MEDIUM"

    def get_care_level(self, obj):
        return "EASY"

    def create(self, validated_data):
        primary_image_url = self.initial_data.get("primary_image") or self.initial_data.get("primary_image_url")
        sale_price = self.initial_data.get("sale_price") or self.initial_data.get("price")
        rental_price = self.initial_data.get("rental_price")
        stock_quantity = self.initial_data.get("stock_quantity", 10)

        plant = Plants.objects.create(**validated_data)

        if sale_price or primary_image_url:
            sku = f"SKU-{str(plant.id)[:8].upper()}"
            detail = PlantsDetail.objects.create(
                plant=plant,
                sku=sku,
                size="M",
                sale_price=sale_price or 0,
                rental_price=rental_price or 0,
                stock_quantity=stock_quantity or 10,
                status=PlantsDetail.PlantStatus.AVAILABLE,
            )
            if primary_image_url:
                Media.objects.create(
                    plant_detail=detail,
                    file_url=str(primary_image_url).strip(),
                    media_type=Media.MediaType.IMAGE,
                    is_primary=True,
                    display_order=1,
                )
        return plant

    def update(self, instance, validated_data):
        primary_image_url = self.initial_data.get("primary_image") or self.initial_data.get("primary_image_url")
        sale_price = self.initial_data.get("sale_price") or self.initial_data.get("price")
        rental_price = self.initial_data.get("rental_price")
        stock_quantity = self.initial_data.get("stock_quantity")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        detail = instance.details.first()
        if detail:
            if sale_price is not None:
                detail.sale_price = sale_price
            if rental_price is not None:
                detail.rental_price = rental_price
            if stock_quantity is not None:
                detail.stock_quantity = stock_quantity
            detail.save()

            if primary_image_url:
                primary_media = detail.media.filter(is_primary=True).first() or detail.media.first()
                if primary_media:
                    primary_media.file_url = str(primary_image_url).strip()
                    primary_media.save()
                else:
                    Media.objects.create(
                        plant_detail=detail,
                        file_url=str(primary_image_url).strip(),
                        media_type=Media.MediaType.IMAGE,
                        is_primary=True,
                        display_order=1,
                    )
        elif sale_price or primary_image_url:
            sku = f"SKU-{str(instance.id)[:8].upper()}"
            new_detail = PlantsDetail.objects.create(
                plant=instance,
                sku=sku,
                size="M",
                sale_price=sale_price or 0,
                rental_price=rental_price or 0,
                stock_quantity=stock_quantity or 10,
                status=PlantsDetail.PlantStatus.AVAILABLE,
            )
            if primary_image_url:
                Media.objects.create(
                    plant_detail=new_detail,
                    file_url=str(primary_image_url).strip(),
                    media_type=Media.MediaType.IMAGE,
                    is_primary=True,
                    display_order=1,
                )
        return instance
