from django.db import transaction
from apps.accounts.models import User
from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.constants.choices import ConversationStatus
from apps.common.exceptions import BusinessRuleError


@transaction.atomic
def assign_staff_agent(conversation: ChatConversation, agent: User) -> ChatConversation:
    if not (agent.is_staff or agent.is_superuser):
        raise BusinessRuleError("Chỉ nhân viên có quyền mới được tiếp nhận cuộc trò chuyện.")

    conversation.assigned_agent = agent
    conversation.status = ConversationStatus.AGENT
    conversation.save(update_fields=["assigned_agent", "status", "updated_at"])
    return conversation
