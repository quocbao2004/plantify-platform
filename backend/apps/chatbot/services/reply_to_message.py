from django.db import transaction
from django.utils import timezone
from apps.accounts.models import User
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.models.message import ChatMessage
from apps.chatbot.models.intent import BotIntent
from apps.chatbot.constants.choices import MessageSenderType, ConversationStatus


def find_bot_response_for_text(text: str) -> str:
    """Match keywords against active BotIntents or fallback to default guidance."""
    lower_text = text.lower()
    intents = BotIntent.objects.filter(is_active=True).prefetch_related("responses")
    for intent in intents:
        for kw in intent.keywords:
            if str(kw).lower() in lower_text:
                resp = intent.responses.filter(is_active=True).first()
                if resp:
                    return resp.response_text

    # Default plant knowledge fallback
    if "thuê" in lower_text:
        return "Plantify cung cấp dịch vụ thuê cây cảnh văn phòng và nhà ở trọn gói. Bạn có thể chọn loại cây, thời gian thuê và chúng tôi sẽ hỗ trợ chăm sóc định kỳ."
    if "tưới" in lower_text or "chăm sóc" in lower_text:
        return "Hầu hết các cây nội thất chỉ cần tưới 1-2 lần/tuần khi mặt đất đã se khô. Bạn nên kiểm tra độ ẩm đất trước khi tưới nhé!"

    return "Chào bạn! Tôi là trợ lý ảo Plantify. Bạn cần tư vấn về loài cây cảnh nào, dịch vụ thuê cây hay kỹ thuật chăm sóc cây?"


@transaction.atomic
def process_incoming_chat_message(conversation: ChatConversation, content: str, user: User = None) -> ChatMessage:
    """Save customer message and generate bot reply if in BOT status."""
    # 1. Save user message
    user_msg = ChatMessage.objects.create(
        conversation=conversation,
        sender_type=MessageSenderType.CUSTOMER,
        sender_user=user,
        content=content,
        sent_at=timezone.now(),
    )

    # 2. If conversational status is BOT, auto-reply
    if conversation.status == ConversationStatus.BOT:
        reply_text = find_bot_response_for_text(content)
        bot_msg = ChatMessage.objects.create(
            conversation=conversation,
            sender_type=MessageSenderType.BOT,
            content=reply_text,
            sent_at=timezone.now(),
        )
        return bot_msg

    return user_msg
