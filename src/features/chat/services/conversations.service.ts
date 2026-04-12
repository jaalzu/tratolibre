// chat/services/conversations.service.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

type ConversationSummaryRow =
  Database["public"]["Views"]["conversation_summaries"]["Row"];
type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

/**
 * Obtiene todas las conversaciones del usuario con sus resúmenes
 */
export async function fetchUserConversations(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("conversation_summaries")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  return { data, error };
}

/**
 * Obtiene mensajes no leídos del usuario
 */
export async function fetchUnreadMessages(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .select("conversation_id")
    .eq("read", false)
    .neq("sender_id", userId);

  return { data, error };
}

/**
 * Busca conversación existente por item y comprador
 */
export async function findExistingConversation(
  supabase: SupabaseClient<Database>,
  itemId: string,
  buyerId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("item_id", itemId)
    .eq("buyer_id", buyerId)
    .single();

  return { data, error };
}

/**
 * Crea una nueva conversación
 */
export async function createConversation(
  supabase: SupabaseClient<Database>,
  itemId: string,
  buyerId: string,
  sellerId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ item_id: itemId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single();

  return { data, error };
}

/**
 * Elimina una conversación
 */
export async function deleteConversation(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  return { data, error };
}

/**
 * Obtiene una conversación por ID
 */
export async function fetchConversationById(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("conversation_summaries")
    .select("*")
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .single();

  return { data, error };
}

/**
 * Obtiene conversaciones de un item específico (para vendedor)
 */
export async function fetchConversationsByItem(
  supabase: SupabaseClient<Database>,
  itemId: string,
  sellerId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, buyer_id, buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url)",
    )
    .eq("item_id", itemId)
    .eq("seller_id", sellerId);

  return { data, error };
}

/**
 * Actualiza el timestamp de una conversación
 */
export async function updateConversationTimestamp(
  supabase: SupabaseClient<Database>,
  conversationId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { data, error };
}

/**
 * Verifica si el usuario tiene acceso a la conversación
 */
export async function verifyConversationAccess(
  supabase: SupabaseClient<Database>,
  conversationId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .single();

  return { data, error };
}
