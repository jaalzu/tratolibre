"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createClient } from "@/lib/supabase/server";
import { Item } from "@/features/items/types";

export async function getUserFavorites(): Promise<Item[]> {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("item_id, items(*, profiles(name, avatar_url, rating))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data
    ?.map((f) => f.items as unknown as Item)
    .filter((item): item is Item => !!item && !item.sold && !!item.available) ??
    []) as Item[];
}

export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", userId);
  return data?.map((f) => f.item_id) ?? [];
}
