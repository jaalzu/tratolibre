"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { getMyConversations } from "@/features/chat/actions/conversations/index";
import { createClient } from "@/lib/supabase/client";

export function ChatStoreInit({ userId }: { userId?: string }) {
  const setConversations = useChatStore((state) => state.setConversations);
  const setLoading = useChatStore((state) => state.setLoading);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // fetch inicial
    const fetchConversations = () => {
      getMyConversations().then((conversations) => {
        setConversations(conversations);
        setLoading(false);
      });
    };

    fetchConversations();

    // suscripción a mensajes nuevos o actualizados
    const channel = supabase
      .channel("global-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => fetchConversations(), // refresca cuando hay cambios
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
}
