from rest_framework import serializers
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.models.message import ChatMessage
from apps.chatbot.models.intent import BotIntent


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_type_display = serializers.CharField(source="get_sender_type_display", read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "conversation", "sender_type", "sender_type_display", "content", "sent_at"]
        read_only_fields = ["id", "sender_type", "sent_at"]


class ChatConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ChatConversation
        fields = ["id", "status", "status_display", "assigned_agent", "messages", "created_at"]
        read_only_fields = ["id", "status", "assigned_agent", "created_at"]


class BotIntentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotIntent
        fields = ["id", "name", "keywords", "is_active", "priority"]
