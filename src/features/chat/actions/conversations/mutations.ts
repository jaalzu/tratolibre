"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";

export async function getOrCreateConversation(
  itemId: string,
  sellerId: string,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };
  if (user.id === sellerId) return { error: "No podés chatear con vos mismo" };

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("item_id", itemId)
    .eq("buyer_id", user.id)
    .single();

  if (existing) return { data: existing };

  const { data, error } = await supabase
    .from("conversations")
    .insert({ item_id: itemId, buyer_id: user.id, seller_id: sellerId })
    .select()
    .single();

  if (error) {
    return { error: mapSupabaseError(error) };
  }

  return { data };
}

export async function deleteConversationAction(conversationId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

  if (error) {
    return { error: mapSupabaseError(error) };
  }

  revalidatePath("/chat", "layout");
  return { success: true };
}
