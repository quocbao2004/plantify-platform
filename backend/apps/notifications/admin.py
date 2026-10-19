from django.contrib import admin
from apps.notifications.models.notification import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "type", "is_read", "created_at")
    list_filter = ("type", "is_read")
    search_fields = ("title", "body", "user__email")
