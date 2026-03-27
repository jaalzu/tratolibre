import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { markMessagesAsRead } from "../actions/messages/queries";
import { messagesQuery } from "../queries";

export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const markedSet = useRef<Set<string>>(new Set());

  const { data: messages = [], isPlaceholderData } = useQuery(
    messagesQuery(conversationId),
  );

  useEffect(() => {
    if (messages.length === 0) return;
    if (isPlaceholderData) return;
    if (markedSet.current.has(conversationId)) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      markedSet.current.add(conversationId);
      markMessagesAsRead(conversationId).then(() => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      });
    }, 500);

    return () => clearTimeout(timeoutRef.current);
  }, [conversationId, messages.length, isPlaceholderData, queryClient]);
}
