from typing import Optional
from django.db.models import QuerySet
from apps.accounts.models import User
from apps.chatbot.models.conversation import ChatConversation


def get_user_conversations(user: User) -> QuerySet[ChatConversation]:
    return ChatConversation.objects.filter(user=user).prefetch_related("messages").order_by("-created_at")


def get_conversation_by_id(conversation_id: str, user: Optional[User] = None) -> Optional[ChatConversation]:
    qs = ChatConversation.objects.filter(id=conversation_id).prefetch_related("messages")
    if user and not user.is_staff:
        qs = qs.filter(user=user)
    return qs.first()
