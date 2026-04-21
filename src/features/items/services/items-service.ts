import { SupabaseClient } from "@supabase/supabase-js";
import { ItemInsert, ItemUpdateData, ItemSearchParams, Item } from "../types";

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
  data: ItemUpdateData,
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

export async function getItems(
  supabase: SupabaseClient,
  params: ItemSearchParams,
): Promise<Item[]> {
  let query = supabase.from("items").select("*");

  // 1. Filtros (Keywords, Categoría, etc.)
  if (params.keywords) query = query.ilike("title", `%${params.keywords}%`);
  if (params.category) query = query.eq("category", params.category);
  if (params.province) query = query.eq("province", params.province);

  if (params.min_price)
    query = query.gte("sale_price", Number(params.min_price));
  if (params.max_price)
    query = query.lte("sale_price", Number(params.max_price));

  const orderBy = params.order_by ?? "newest";

  switch (orderBy) {
    case "price_desc":
      query = query.order("sale_price", { ascending: false });
      break;
    case "price_asc":
      query = query.order("sale_price", { ascending: true });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error en getItems:", error);
    return [];
  }

  return data || [];
}
