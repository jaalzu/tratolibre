// chat/hooks/usePresence.ts
"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UsePresenceOptions {
  conversationId: string;
  userId: string;
}

export function usePresence({ conversationId, userId }: UsePresenceOptions) {
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    const initPresence = async () => {
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
          setIsOtherOnline(others.length > 0);
        })
        .on("presence", { event: "join" }, ({ key }: { key: string }) => {
          if (key !== userId) setIsOtherOnline(true);
        })
        .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
          if (key !== userId) setIsOtherOnline(false);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({ userId, online: true });
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            if (process.env.NODE_ENV === "development") {
              console.warn("Presence channel error:", status);
            }
          }
        });
    };

    initPresence();

    return () => {
      if (supabaseRef.current && channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
      }
      channelRef.current = null;
    };
  }, [conversationId, userId]);

  return { isOtherOnline };
}
