import { SupabaseClient } from "@supabase/supabase-js";
import { SearchParams, DateFilter } from "../types";

export async function getSearchItemsService(
  supabase: SupabaseClient,
  params: SearchParams,
) {
  // 1. Empezamos la query
  let q = supabase
    .from("items")
    .select("*, profiles(name, avatar_url, rating)")
    .eq("available", true)
    .eq("sold", false);

  // 2. Filtro de búsqueda (Trim y Lowercase para asegurar)
  const search = params.keywords?.trim();

  if (search) {
    // IMPORTANTE: Asegúrate que la columna en tu DB sea 'title'
    q = q.ilike("title", `%${search}%`);
  }

  // 3. Filtros adicionales (Solo si tienen valor real)
  if (params.category) q = q.eq("category", params.category);
  if (params.province) q = q.eq("province", params.province);
  if (params.condition) q = q.eq("condition", params.condition);

  if (params.min_price && !isNaN(Number(params.min_price))) {
    q = q.gte("sale_price", params.min_price);
  }
  if (params.max_price && !isNaN(Number(params.max_price))) {
    q = q.lte("sale_price", params.max_price);
  }

  // 4. Ordenamiento
  const orderColumn =
    params.order_by === "price_asc" || params.order_by === "price_desc"
      ? "sale_price"
      : "created_at";

  const isAscending = params.order_by === "price_asc";

  q = q.order(orderColumn, { ascending: isAscending });

  // DEBUG: Vamos a ver qué está devolviendo realmente
  const { data, error, count } = await q;

  if (error) {
    console.error("ERROR EN SUPABASE SERVICE:", error);
  }

  return {
    data: data ?? [],
    error,
  };
}
