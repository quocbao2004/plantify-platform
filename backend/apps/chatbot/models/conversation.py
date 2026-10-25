from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.chatbot.constants.choices import ConversationStatus


class ChatConversation(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="chat_conversations",
        verbose_name="Khách hàng",
    )
    status = models.CharField(
        max_length=20,
        choices=ConversationStatus.choices,
        default=ConversationStatus.BOT,
        db_index=True,
    )
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_chat_conversations",
        verbose_name="Nhân viên phụ trách",
    )
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "chatbot_conversations"
        verbose_name = "Cuộc trò chuyện"
        verbose_name_plural = "Cuộc trò chuyện"
        ordering = ["-created_at"]

    def __str__(self):
        user_str = self.user.email if self.user else "Khách vãng lai"
        return f"Chat #{self.id} - {user_str} ({self.get_status_display()})"
