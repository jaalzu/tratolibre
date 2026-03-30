"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import { Database } from "@/lib/supabase/database.types";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

export async function getMyConversations() {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  const [{ data: conversations, error: convError }, { data: unreadData }] =
    await Promise.all([
      supabase
        .from("conversation_summaries")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false }),
      supabase
        .from("messages")
        .select("conversation_id")
        .eq("read", false)
        .neq("sender_id", user.id),
    ]);

  // Si hay error crítico en conversations, loggear pero devolver array vacío
  if (convError) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching conversations:", convError);
    }
    return [];
  }

  if (!conversations?.length) return [];

  const unreadMap = (unreadData ?? []).reduce(
    (acc: Record<string, number>, msg: Pick<MessageRow, "conversation_id">) => {
      if (!msg.conversation_id) return acc;
      acc[msg.conversation_id] = (acc[msg.conversation_id] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return conversations.map((conv) => ({
    ...conv,
    lastMessage: conv.last_message_content
      ? { content: conv.last_message_content, created_at: conv.last_message_at }
      : null,
    hasUnread: (unreadMap[conv.id] ?? 0) > 0,
    unreadCount: unreadMap[conv.id] ?? 0,
  }));
}

export async function getConversationById(id: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("conversation_summaries")
    .select("*")
    .eq("id", id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching conversation:", error);
    }
    return null;
  }

  return data ?? null;
}

export async function getConversationsByItem(itemId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, buyer_id, buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url)",
    )
    .eq("item_id", itemId)
    .eq("seller_id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching conversations by item:", error);
    }
    return [];
  }

  return data ?? [];
}

export async function getTotalUnreadCount() {
  const { supabase, user } = await getAuthUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching unread count:", error);
    }
    return 0;
  }

  return count ?? 0;
}
