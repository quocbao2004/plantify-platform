import uuid
from rest_framework import serializers
from apps.catalog.models import Category, Plants, PlantsDetail, Media
from apps.catalog.utils.plant_code import (
    generate_plant_code_prefix,
    generate_plant_assets_for_detail,
)


class CategorySerializer(serializers.ModelSerializer):
    plants_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image_url",
            "is_active",
            "sort_order",
            "plants_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "plants_count", "created_at", "updated_at"]

    def get_plants_count(self, obj):
        return getattr(obj, "plants_count_annotated", None) if hasattr(obj, "plants_count_annotated") else obj.plants.count()


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
    min_sale_price_vnd = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()
    primary_asset_code = serializers.SerializerMethodField()
    assets_count = serializers.SerializerMethodField()
    units_sold = serializers.IntegerField(read_only=True)

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
            "care_level",
            "light_requirement",
            "is_active",
            "details",
            "variants",
            "primary_image",
            "images",
            "sale_price",
            "rental_price",
            "min_sale_price_vnd",
            "primary_asset_code",
            "assets_count",
            "units_sold",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]

    def get_primary_asset_code(self, obj):
        first_detail = next(iter(obj.details.all()), None)
        first_asset = next(iter(first_detail.assets.all()), None) if first_detail else None
        return first_asset.asset_code if first_asset else None

    def get_assets_count(self, obj):
        details = getattr(obj, "details", None)
        if details:
            return sum(d.assets.count() for d in details.all())
        return 0

    def get_primary_image(self, obj):
        images = self.get_images(obj)
        primary = next((image for image in images if image["is_primary"]), None)
        return (primary or images[0])["image"] if images else None

    def get_images(self, obj):
        imgs = []
        details = getattr(obj, "details", None)
        if details:
            for detail in details.all():
                for m in detail.media.all():
                    if m.media_type != Media.MediaType.IMAGE:
                        continue
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
            prices = [d.sale_price for d in details.all() if d.sale_price and d.sale_price > 0]
            if prices:
                return float(min(prices))
        return 0

    def get_rental_price(self, obj):
        details = getattr(obj, "details", None)
        if details:
            prices = [d.rental_price for d in details.all() if d.rental_price is not None]
            if prices:
                return float(min(prices))
        return 0

    def get_min_sale_price_vnd(self, obj):
        return self.get_sale_price(obj)

    def get_variants(self, obj):
        details = getattr(obj, "details", None)
        if not details:
            return []
        res = []
        for d in details.all():
            res.append({
                "id": str(d.id),
                "sku": d.sku,
                "size": d.size or "M",
                "size_display": f"Size {d.size}" if d.size else "Mặc định",
                "height_cm": float(d.height) if d.height is not None else None,
                "sale_price_vnd": float(d.sale_price) if d.sale_price is not None else 0,
                "deposit_vnd": float(d.rental_price) if d.rental_price is not None else 0,
                "stock_quantity": d.stock_quantity,
                "can_sell": bool(d.sale_price and d.sale_price > 0),
                "can_rent": bool(d.rental_price and d.rental_price > 0),
                "is_active": d.status == PlantsDetail.PlantStatus.AVAILABLE,
                "rental_rates": [],
            })
        return res

    def create(self, validated_data):
        primary_image_url = self.initial_data.get("primary_image") or self.initial_data.get("primary_image_url")
        sale_price = self.initial_data.get("sale_price") or self.initial_data.get("price")
        rental_price = self.initial_data.get("rental_price")
        stock_quantity = int(self.initial_data.get("stock_quantity") or 1)

        plant = Plants.objects.create(**validated_data)

        # Tạo mã SKU và tiền tố mã định danh cây từ tên cây
        prefix = generate_plant_code_prefix(plant.name)
        sku = f"SKU-{prefix}"
        if PlantsDetail.objects.filter(sku=sku).exists():
            sku = f"SKU-{prefix}-{str(plant.id)[:4].upper()}"

        detail = PlantsDetail.objects.create(
            plant=plant,
            sku=sku,
            size="M",
            sale_price=sale_price or 0,
            rental_price=rental_price or 0,
            stock_quantity=stock_quantity,
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

        # TỰ ĐỘNG SINH MÃ ĐỊNH DANH CÂY CẢNH (PlantAsset) THEO SỐ LƯỢNG TỒN KHO
        # Ví dụ: Tên "Lan Đột Tử", số lượng = 1 -> tự sinh mã LDT-0001
        generate_plant_assets_for_detail(
            plant_detail=detail,
            quantity=stock_quantity,
            prefix=prefix,
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

        prefix = generate_plant_code_prefix(instance.name)
        detail = instance.details.first()
        if detail:
            if sale_price is not None:
                detail.sale_price = sale_price
            if rental_price is not None:
                detail.rental_price = rental_price
            if stock_quantity is not None:
                new_qty = max(0, int(stock_quantity))
                detail.stock_quantity = new_qty
                # Tự động sinh thêm mã cây nếu số lượng mới lớn hơn số asset hiện tại
                current_assets_count = detail.assets.count()
                if new_qty > current_assets_count:
                    generate_plant_assets_for_detail(
                        plant_detail=detail,
                        quantity=new_qty - current_assets_count,
                        prefix=prefix,
                    )
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
        else:
            new_qty = max(0, int(stock_quantity or 1))
            sku = f"SKU-{prefix}"
            if PlantsDetail.objects.filter(sku=sku).exists():
                sku = f"SKU-{prefix}-{str(instance.id)[:4].upper()}"
            new_detail = PlantsDetail.objects.create(
                plant=instance,
                sku=sku,
                size="M",
                sale_price=sale_price or 0,
                rental_price=rental_price or 0,
                stock_quantity=new_qty,
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
            generate_plant_assets_for_detail(
                plant_detail=new_detail,
                quantity=new_qty,
                prefix=prefix,
            )
        return instance
