// features/items/services/items-service.ts
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
export async function getItems(supabase: SupabaseClient, params: any) {
  let query = supabase.from("items").select("*");

  // 1. Filtros (Keywords, Categoría, etc.) - Estos están bien
  if (params.keywords) query = query.ilike("title", `%${params.keywords}%`);
  if (params.category) query = query.eq("category", params.category);
  if (params.province) query = query.eq("province", params.province);

  if (params.min_price)
    query = query.gte("sale_price", Number(params.min_price));
  if (params.max_price)
    query = query.lte("sale_price", Number(params.max_price));

  // 2. LÓGICA DE ORDENAMIENTO (Sin pisarse)
  const orderRaw = String(params.order_by || "");

  if (orderRaw === "price_desc") {
    // Mayor precio primero
    query = query.order("sale_price", { ascending: false });
  } else if (orderRaw === "price_asc") {
    // Menor precio primero
    query = query.order("sale_price", { ascending: true });
  } else if (orderRaw === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    // Por defecto: los más nuevos arriba
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error en getItems:", error);
    return [];
  }

  return data || [];
}
