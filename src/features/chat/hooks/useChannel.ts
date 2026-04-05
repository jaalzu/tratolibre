"use client";

import { useEffect, useRef } from "react";

interface UseChannelOptions {
  conversationId: string;
  userId: string;
  onTyping: (isTyping: boolean) => void;
  onNewMessage: () => void;
  onOnlineChange: (isOnline: boolean) => void;
}

export function useChannel({
  conversationId,
  userId,
  onTyping,
  onNewMessage,
  onOnlineChange,
}: UseChannelOptions) {
  const channelRef = useRef<any>(null);
  const supabaseRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const initChannel = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      supabaseRef.current = supabase;

      const channel = supabase.channel(`presence:${conversationId}`, {
        config: { presence: { key: userId } },
      });

      channelRef.current = channel;

      channel
        .on("presence", { event: "sync" }, () => {
          const others = Object.keys(channel.presenceState()).filter(
            (k) => k !== userId,
          );
          onOnlineChange(others.length > 0);
        })
        .on("presence", { event: "join" }, ({ key }: { key: string }) => {
          if (key !== userId) onOnlineChange(true);
        })
        .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
          if (key !== userId) onOnlineChange(false);
        })
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (payload.userId !== userId) {
            onTyping(true);
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
          }
        })
        .on("broadcast", { event: "new_message" }, () => {
          onNewMessage();
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && channelRef.current) {
            await channel.track({ userId, online: true });
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.warn("Canal desconectado:", status);
          }
        });
    };

    initChannel();

    return () => {
      clearTimeout(typingTimeoutRef.current);
      if (supabaseRef.current && channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
      }
      channelRef.current = null;
    };
  }, [conversationId, userId, onTyping, onNewMessage, onOnlineChange]);

  const sendTyping = () => {
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId },
    });
  };

  const sendNewMessage = () => {
    channelRef.current?.send({
      type: "broadcast",
      event: "new_message",
      payload: {},
    });
  };

  return { sendTyping, sendNewMessage };
}
