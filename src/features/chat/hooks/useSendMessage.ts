import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sendMessageAction } from "@/features/chat/actions/messages";
import { Message } from "@/features/chat/types";

interface Options {
  conversationId: string;
  userId: string;
  onSend: () => void;
  onScroll: () => void;
  onTyping: () => void;
}

export function useSendMessage({
  conversationId,
  userId,
  onSend,
  onScroll,
  onTyping,
}: Options) {
  const [input, setInputRaw] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const setInput = useCallback(
    (val: string) => {
      setInputRaw(val);
      onTyping();
    },
    [onTyping],
  );

  const sendMessage = useCallback(async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    setSendError(null);
    const content = input.trim();
    setInputRaw("");

    queryClient.setQueryData(
      ["messages", conversationId],
      (prev: Message[] = []) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          sender_id: userId,
          content,
          created_at: new Date().toISOString(),
          profiles: null,
        },
      ],
    );
    onScroll();

    const result = await sendMessageAction(conversationId, content);

    if (result?.error) {
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
