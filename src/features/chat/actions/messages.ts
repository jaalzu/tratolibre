"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_LENGTH = 1000;

export async function markMessagesAsRead(conversationId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("read", false);

  // revalidatePath eliminado — el cliente ya invalida con queryClient
}

export async function sendMessageAction(
  conversationId: string,
  content: string,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const trimmed = content.trim();
  if (!trimmed) return { error: "El mensaje no puede estar vacío" };
  if (trimmed.length > MAX_LENGTH)
    return { error: `Máximo ${MAX_LENGTH} caracteres` };

  // Rate limit y verificación de conversación en paralelo
  const [allowed, { data: conversation }] = await Promise.all([
    checkRateLimit(supabase, user.id, "send_message", 30, 1),
    supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single(),
  ]);

  if (!allowed)
    return { error: "Estás enviando mensajes muy rápido, esperá un momento" };
  if (!conversation) return { error: "Conversación no encontrada" };

  const { error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: trimmed,
    });

  if (msgError) return { error: msgError.message };

  // Eliminá esta query si tenés un trigger updated_at en la DB — es redundante
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { success: true };
}
