// features/items/services/sales.service.ts

import { SupabaseClient } from "@supabase/supabase-js";

export async function getItemForSale(
  supabase: SupabaseClient,
  itemId: string,
  ownerId: string,
) {
  const { data } = await supabase
    .from("items")
    .select("sale_price, title")
    .eq("id", itemId)
    .eq("owner_id", ownerId)
    .single();

  return data;
}

export async function markItemAsSold(
  supabase: SupabaseClient,
  itemId: string,
  ownerId: string,
) {
  const { error } = await supabase
    .from("items")
    .update({
      sold: true,
      available: false,
      sold_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("owner_id", ownerId);

  return { error };
}

export async function createPurchase(
  supabase: SupabaseClient,
  {
    itemId,
    buyerId,
    ownerId,
    salePrice,
  }: {
    itemId: string;
    buyerId: string;
    ownerId: string;
    salePrice: number;
  },
) {
  const { data, error } = await supabase
    .from("purchases")
    .insert({
      item_id: itemId,
      buyer_id: buyerId,
      owner_id: ownerId,
      sale_price: salePrice,
      status: "completed",
    })
    .select()
    .single();

  return { data, error };
}
