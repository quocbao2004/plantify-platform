from django.contrib import admin
from apps.catalog.models import Category, Plants, PlantsDetail, Media


class MediaInline(admin.TabularInline):
    model = Media
    extra = 1


class PlantsDetailInline(admin.StackedInline):
    model = PlantsDetail
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Plants)
class PlantsAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "slug", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PlantsDetailInline]


@admin.register(PlantsDetail)
class PlantsDetailAdmin(admin.ModelAdmin):
    list_display = ("sku", "plant", "size", "height", "sale_price", "rental_price", "stock_quantity", "status")
    list_filter = ("status", "size")
    search_fields = ("sku", "plant__name")
    inlines = [MediaInline]


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("plant_detail", "media_type", "is_primary", "display_order", "created_at")
    list_filter = ("media_type", "is_primary")
