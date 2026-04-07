// features/items/services/favorites.service.ts

import { SupabaseClient } from "@supabase/supabase-js";

export async function checkFavoriteExists(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
) {
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  return data;
}

export async function removeFavorite(
  supabase: SupabaseClient,
  favoriteId: string,
) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", favoriteId);

  return { error };
}

export async function addFavorite(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
) {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, item_id: itemId });

  return { error };
}
