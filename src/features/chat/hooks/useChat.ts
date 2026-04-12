import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesQuery } from "../queries";
import { usePresence } from "./usePresence";
import { useMessageBroadcast } from "./useMessageBroadcast";
import { useScrollToBottom } from "./useScrollToBottom";
import { useMarkAsRead } from "./useMarkAsRead";
import { useSendMessage } from "./useSendMessage";

export function useChat(conversationId: string, userId: string) {
  const queryClient = useQueryClient();

  const { bottomRef, scrollToBottom } = useScrollToBottom();

  const { isOtherOnline } = usePresence({ conversationId, userId });

  const { sendNewMessage } = useMessageBroadcast({
    conversationId,
    onNewMessage: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
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
  };
}
