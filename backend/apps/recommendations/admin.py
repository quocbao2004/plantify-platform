from django.contrib import admin
from apps.recommendations.models.activity_event import UserActivityEvent
from apps.recommendations.models.recommendation_log import RecommendationLog


@admin.register(UserActivityEvent)
class UserActivityEventAdmin(admin.ModelAdmin):
    list_display = ("user", "anonymous_session_id", "product", "event_type", "occurred_at")
    list_filter = ("event_type", "occurred_at")
    search_fields = ("user__email", "product__name", "search_query")


@admin.register(RecommendationLog)
class RecommendationLogAdmin(admin.ModelAdmin):
    list_display = ("user", "strategy", "generated_at")
    list_filter = ("strategy",)
