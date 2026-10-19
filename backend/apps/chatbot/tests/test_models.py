import pytest
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.models.message import ChatMessage
from apps.chatbot.constants.choices import ConversationStatus, MessageSenderType


@pytest.mark.django_db
def test_chat_conversation_and_message():
    conv = ChatConversation.objects.create(status=ConversationStatus.BOT)
    msg = ChatMessage.objects.create(
        conversation=conv,
        sender_type=MessageSenderType.BOT,
        content="Chào bạn!",
    )
    assert conv.status == ConversationStatus.BOT
    assert msg.content == "Chào bạn!"
