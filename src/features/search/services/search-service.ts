import { SupabaseClient } from "@supabase/supabase-js";
import { BaseSearchParams } from "../types";

export async function getSearchItemsService(
  supabase: SupabaseClient,
  params: BaseSearchParams,
) {
  let q = supabase
    .from("items")
    .select("*, profiles(name, avatar_url, rating)")
    .eq("available", true)
    .eq("sold", false);

  // Filtros
  const search = params.keywords?.trim();
  if (search) q = q.ilike("title", `%${search}%`);

  if (params.category) q = q.eq("category", params.category);
  if (params.province) q = q.eq("province", params.province);
  if (params.condition) q = q.eq("condition", params.condition);

  if (params.min_price && !isNaN(Number(params.min_price))) {
    q = q.gte("sale_price", params.min_price);
  }
  if (params.max_price && !isNaN(Number(params.max_price))) {
    q = q.lte("sale_price", params.max_price);
  }

  // Ordenamiento
  switch (params.order_by) {
    case "price_asc":
      q = q.order("sale_price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("sale_price", { ascending: false });
      break;
    case "oldest":
      q = q.order("created_at", { ascending: true });
      break;
    case "newest":
    default:
      q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;

  if (error) {
    console.error("ERROR EN SUPABASE SERVICE:", error);
  }

  return {
    data: data ?? [],
    error,
  };
}
