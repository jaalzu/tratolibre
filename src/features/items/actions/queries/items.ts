// features/items/queries/items.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  applyItemFilters,
  applyItemSorting,
  type GetItemsParams,
} from "../../services/item-filters.service";

export async function getItemById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*, profiles(id, name, avatar_url, rating, reviews_count)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getItems(params: GetItemsParams = {}) {
  const supabase = await createClient();
  const limit = params.limit ?? 12;
  const page = params.page ?? 0;
  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("items")
    .select("*, profiles(name, avatar_url, rating)")
    .eq("available", true)
    .eq("sold", false)
    .range(from, to);

  query = applyItemFilters(query, params);
  query = applyItemSorting(query, params.order_by);

  const { data } = await query;
  return data ?? [];
}
