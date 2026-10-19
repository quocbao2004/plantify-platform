from django.urls import path
from apps.chatbot.views.conversations import ConversationListCreateView
from apps.chatbot.views.messages import MessageListCreateView
from apps.chatbot.views.admin_intents import AdminBotIntentListView

app_name = "chatbot"

urlpatterns = [
    path("conversations/", ConversationListCreateView.as_view(), name="conversation-list-create"),
    path("conversations/<uuid:id>/messages/", MessageListCreateView.as_view(), name="conversation-messages"),
    path("admin/intents/", AdminBotIntentListView.as_view(), name="admin-intents"),
]
