from django.contrib import admin
from apps.catalog.models.category import Category
from apps.catalog.models.product import Product
from apps.catalog.models.image import ProductImage
from apps.catalog.models.variant import ProductVariant
from apps.catalog.models.rental_rate import RentalRate


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.StackedInline):
    model = ProductVariant
    extra = 1


class RentalRateInline(admin.TabularInline):
    model = RentalRate
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "light_requirement", "care_level", "is_active", "created_at")
    list_filter = ("category", "light_requirement", "care_level", "is_active")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVariantInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ("sku", "product", "size", "sale_price_vnd", "deposit_vnd", "can_sell", "can_rent", "is_active")
    list_filter = ("can_sell", "can_rent", "size", "is_active")
    search_fields = ("sku", "product__name")
    inlines = [RentalRateInline]
