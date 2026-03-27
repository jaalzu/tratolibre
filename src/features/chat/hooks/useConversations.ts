"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { conversationsQuery } from "@/features/chat/queries";
import { useChatStore } from "@/store/chatStore";

export function useConversations() {
  const setConversations = useChatStore((state) => state.setConversations);
  const setLoading = useChatStore((state) => state.setLoading);
  const prevDataRef = useRef<string>("");

  const { data: conversations = [], isLoading } = useQuery(conversationsQuery);

  useEffect(() => {
    const serialized = JSON.stringify(conversations);
    if (serialized === prevDataRef.current) return;
    prevDataRef.current = serialized;
    setConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
}
