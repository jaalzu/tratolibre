import { createClient } from "@/lib/supabase/client";
import { getMyConversations } from "@/features/chat/actions/conversations/index";
import { keepPreviousData } from "@tanstack/react-query";

export async function fetchMessages(conversationId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, profiles(name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(100);
  return data ?? [];
}

export const conversationsQuery = {
  queryKey: ["conversations"] as const,
  queryFn: getMyConversations,
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 5,
  refetchInterval: 23000,
  refetchOnWindowFocus: true,
};

export const messagesQuery = (conversationId: string) => ({
  queryKey: ["messages", conversationId] as const,
  queryFn: () => fetchMessages(conversationId),
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 2,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  placeholderData: keepPreviousData,
});
