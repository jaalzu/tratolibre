"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";

export async function toggleFavoriteAction(itemId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return { favorited: false };
  }

  await supabase
    .from("favorites")
    .insert({ user_id: user.id, item_id: itemId });
  return { favorited: true };
}
