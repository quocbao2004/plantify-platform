from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.chatbot.serializers.chat import ChatMessageSerializer, ChatConversationSerializer
from apps.chatbot.selectors.conversations import get_conversation_by_id
from apps.chatbot.services.reply_to_message import process_incoming_chat_message
from apps.common.exceptions import ConflictError


class MessageListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        conv = get_conversation_by_id(str(id), user=request.user)
        if not conv:
            raise ConflictError("Không tìm thấy cuộc trò chuyện.")
        return Response({"success": True, "data": ChatConversationSerializer(conv).data})

    def post(self, request, id):
        conv = get_conversation_by_id(str(id), user=request.user)
        if not conv:
            raise ConflictError("Không tìm thấy cuộc trò chuyện.")

        content = request.data.get("content", "").strip()
        if not content:
            return Response({"success": False, "message": "Nội dung tin nhắn không được rỗng."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None
        reply = process_incoming_chat_message(conv, content=content, user=user)
        return Response({"success": True, "data": ChatMessageSerializer(reply).data}, status=status.HTTP_201_CREATED)
