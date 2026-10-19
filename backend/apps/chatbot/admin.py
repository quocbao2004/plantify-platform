from django.contrib import admin
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.models.message import ChatMessage
from apps.chatbot.models.intent import BotIntent
from apps.chatbot.models.response import BotResponse


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ("sender_type", "content", "sent_at")


@admin.register(ChatConversation)
class ChatConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "assigned_agent", "created_at")
    list_filter = ("status",)
    inlines = [ChatMessageInline]


class BotResponseInline(admin.TabularInline):
    model = BotResponse
    extra = 1


@admin.register(BotIntent)
class BotIntentAdmin(admin.ModelAdmin):
    list_display = ("name", "priority", "is_active")
    inlines = [BotResponseInline]
