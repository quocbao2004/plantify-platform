from django.db import models
from apps.common.models.base import UUIDTimeStampedModel


class BotIntent(UUIDTimeStampedModel):
    name = models.CharField(max_length=100, unique=True, verbose_name="Tên ý định / Chủ đề")
    keywords = models.JSONField(default=list, help_text="Danh sách từ khóa khớp ý định")
    is_active = models.BooleanField(default=True, db_index=True)
    priority = models.IntegerField(default=0, db_index=True)

    class Meta:
        db_table = "chatbot_intents"
        verbose_name = "Ý định Chatbot"
        verbose_name_plural = "Ý định Chatbot"
        ordering = ["-priority", "name"]

    def __str__(self):
        return self.name
