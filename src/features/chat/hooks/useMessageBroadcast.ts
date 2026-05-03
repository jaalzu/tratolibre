"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client/browser";

interface UseMessageBroadcastOptions {
  conversationId: string;
  onNewMessage?: () => void;
}

export function useMessageBroadcast({
  conversationId,
  onNewMessage,
}: UseMessageBroadcastOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;

    const channel = supabase.channel(`broadcast:${conversationId}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "new_message" }, () => {
        queryClient.refetchQueries({
          queryKey: ["messages", conversationId],
        });
        onNewMessage?.();
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          if (process.env.NODE_ENV === "development") {
            console.warn("Broadcast channel error:", status);
          }
        }
      });

    return () => {
      if (supabaseRef.current && channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
      }
      channelRef.current = null;
    };
  }, [conversationId, onNewMessage, queryClient]);

  const sendNewMessage = () => {
    channelRef.current?.send(
      {
        type: "broadcast",
        event: "new_message",
        payload: {},
      },
      {
        httpSend: true,
      },
    );
  };

  return { sendNewMessage };
}
