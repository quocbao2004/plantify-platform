from rest_framework import generics
from apps.common.permissions.is_staff import IsStaffUser
from apps.chatbot.models.intent import BotIntent
from apps.chatbot.serializers.chat import BotIntentSerializer


class AdminBotIntentListView(generics.ListCreateAPIView):
    permission_classes = [IsStaffUser]
    serializer_class = BotIntentSerializer
    queryset = BotIntent.objects.all().order_by("-priority")
