// chat/hooks/useSendMessage.ts
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sendMessageAction } from "../actions";
import type { MessageWithProfile } from "../schemas";

interface Options {
  conversationId: string;
  userId: string;
  onSend: () => void;
  onScroll: () => void;
  // onTyping: () => void;
}

export function useSendMessage({
  conversationId,
  userId,
  onSend,
  onScroll,
}: Options) {
  const [input, setInputRaw] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const setInput = useCallback((val: string) => {
    setInputRaw(val);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    setSendError(null);
    const content = input.trim();
    setInputRaw("");

    // Optimistic update
    // Optimistic update
    queryClient.setQueryData(
      ["messages", conversationId],
      (prev: MessageWithProfile[] = []) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          conversation_id: conversationId,
          sender_id: userId,
          content,
          read: false,
          created_at: new Date().toISOString(),
          profiles: null,
        },
      ],
    );
    onScroll();

    const result = await sendMessageAction(conversationId, content);

    // Type narrowing con 'error' in result
    if ("error" in result) {
      setSendError(result.error);
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    } else {
      onSend();
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }

    setSending(false);
  }, [input, sending, conversationId, userId, queryClient, onSend, onScroll]);

  return { input, setInput, sending, sendError, sendMessage };
}
