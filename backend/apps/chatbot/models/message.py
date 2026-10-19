from django.conf import settings
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.constants.choices import MessageSenderType


class ChatMessage(UUIDTimeStampedModel):
    conversation = models.ForeignKey(
        ChatConversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender_type = models.CharField(
        max_length=20,
        choices=MessageSenderType.choices,
        default=MessageSenderType.CUSTOMER,
        db_index=True,
    )
    sender_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_chat_messages",
    )
    content = models.TextField(verbose_name="Nội dung tin nhắn")
    sent_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "chatbot_messages"
        verbose_name = "Tin nhắn"
        verbose_name_plural = "Tin nhắn"
        ordering = ["sent_at"]

    def __str__(self):
        return f"[{self.get_sender_type_display()}] {self.content[:40]}"
