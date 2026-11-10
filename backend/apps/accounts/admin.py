from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.accounts.models import User, Staff


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "full_name", "role", "is_staff", "is_active", "date_joined")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("email", "full_name", "phone")
    ordering = ("-date_joined",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Thông tin cá nhân", {"fields": ("full_name", "phone", "role")}),
        ("Quyền hạn", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Thời gian", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "role", "password"),
            },
        ),
    )


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("staff_code", "user", "department", "position", "is_available", "created_at")
    list_filter = ("department", "position", "is_available")
    search_fields = ("staff_code", "user__full_name", "user__email")
