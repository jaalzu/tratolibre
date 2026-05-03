"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client/browser";

interface UsePresenceOptions {
  conversationId: string;
  userId: string;
}

export function usePresence({ conversationId, userId }: UsePresenceOptions) {
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef<any>(null);
  const setupRef = useRef(false);

  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;

    const supabase = createClient(); // ✅ Ya no es async
    supabaseRef.current = supabase;

    const channelName = `presence:${conversationId}`;

    supabase.getChannels().forEach((ch) => {
      if (ch.topic === `realtime:${channelName}`) {
        supabase.removeChannel(ch);
      }
    });

    const channel = supabase.channel(channelName, {
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

    return () => {
      setupRef.current = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (supabaseRef.current && channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
      }
      channelRef.current = null;
    };
  }, [conversationId, userId]);

  return { isOtherOnline };
}
