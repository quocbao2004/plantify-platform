from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.chatbot.models.conversation import ChatConversation
from apps.chatbot.serializers.chat import ChatConversationSerializer
from apps.chatbot.selectors.conversations import get_user_conversations, get_conversation_by_id


class ConversationListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"success": True, "data": []})
        convs = get_user_conversations(request.user)
        return Response({"success": True, "data": ChatConversationSerializer(convs, many=True).data})

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        conv = ChatConversation.objects.create(user=user)
        return Response({"success": True, "data": ChatConversationSerializer(conv).data}, status=status.HTTP_201_CREATED)
