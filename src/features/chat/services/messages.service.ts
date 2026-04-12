// chat/services/messages.service.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

/**
 * Obtiene mensajes de una conversación
 */
export async function fetchMessages(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  limit: number = 100,
) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profiles(id, name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  return { data, error };
}

/**
 * Inserta un nuevo mensaje
 */
export async function insertMessage(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  senderId: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Marca mensajes como leídos
 */
export async function markConversationMessagesAsRead(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("read", false);

  return { data, error };
}

/**
 * Cuenta mensajes no leídos totales del usuario
 */
export async function countUnreadMessages(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", userId);

  return { count, error };
}
