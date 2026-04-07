// features/items/services/items.service.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { ItemInsert, ItemUpdate } from "../types";

export async function createItem(supabase: SupabaseClient, data: ItemInsert) {
  const { data: item, error } = await supabase
    .from("items")
    .insert(data)
    .select()
    .single();

  return { item, error };
}

export async function updateItem(
  supabase: SupabaseClient,
  id: string,
  ownerId: string,
  data: Partial<ItemUpdate>,
) {
  const { error } = await supabase
    .from("items")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", ownerId);

  return { error };
}

export async function deleteItem(
  supabase: SupabaseClient,
  id: string,
  ownerId: string,
) {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId);

  return { error };
}
