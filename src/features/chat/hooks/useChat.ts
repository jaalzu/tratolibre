import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { messagesQuery } from "../queries";
import { useChannel } from "./useChannel";
import { useScrollToBottom } from "./useScrollToBottom";
import { useMarkAsRead } from "./useMarkAsRead";
import { useSendMessage } from "./useSendMessage";

export function useChat(conversationId: string, userId: string) {
  const queryClient = useQueryClient();
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const { bottomRef, scrollToBottom } = useScrollToBottom();

  const { sendTyping, sendNewMessage } = useChannel({
    conversationId,
    userId,
    onOnlineChange: setIsOtherOnline,
    onTyping: setIsOtherTyping,
    onNewMessage: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    }, [conversationId, queryClient]),
  });

  const { data: messages = [], isLoading: loading } = useQuery(
    messagesQuery(conversationId),
  );

  useMarkAsRead(conversationId);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const { input, setInput, sending, sendError, sendMessage } = useSendMessage({
    conversationId,
    userId,
    onSend: sendNewMessage,
    onScroll: scrollToBottom,
    onTyping: sendTyping,
  });

  return {
    messages,
    loading,
    bottomRef,
    input,
    setInput,
    sending,
    sendError,
    sendMessage,
    isOtherOnline,
    isOtherTyping,
  };
}
