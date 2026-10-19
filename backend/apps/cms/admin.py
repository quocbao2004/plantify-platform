from django.contrib import admin
from apps.cms.models.post import Post
from apps.cms.models.banner import Banner


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "author", "status", "published_at")
    list_filter = ("status", "type")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "position", "sort_order", "is_active")
    list_filter = ("position", "is_active")
