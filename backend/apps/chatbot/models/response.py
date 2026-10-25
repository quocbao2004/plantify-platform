from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.chatbot.models.intent import BotIntent


class BotResponse(UUIDTimeStampedModel):
    intent = models.ForeignKey(
        BotIntent,
        on_delete=models.CASCADE,
        related_name="responses",
        verbose_name="Ý định",
    )
    response_text = models.TextField(verbose_name="Câu trả lời mẫu")
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "chatbot_responses"
        verbose_name = "Phản hồi Chatbot"
        verbose_name_plural = "Phản hồi Chatbot"

    def __str__(self):
        return f"{self.intent.name}: {self.response_text[:50]}"
