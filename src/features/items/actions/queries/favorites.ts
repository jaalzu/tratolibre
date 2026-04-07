"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createClient } from "@/lib/supabase/server";
import { Item } from "@/features/items/types";

export async function getUserFavorites(): Promise<Item[]> {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("favorites")
      .select("item_id, items(*, profiles(name, avatar_url, rating))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
      data
        ?.map((f) => f.items as unknown as Item)
        .filter(
          (item): item is Item => !!item && !item.sold && !!item.available,
        ) ?? []
    );
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return [];
  }
}

export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("item_id")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return data?.map((f) => f.item_id) ?? [];
  } catch (error) {
    console.error(`Error fetching favorite IDs for user ${userId}:`, error);
    return [];
  }
}
