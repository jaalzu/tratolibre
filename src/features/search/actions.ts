"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserFavoriteIds } from "@/features/items/actions";
import { CATEGORIES } from "@/lib/constants";

export type SearchParams = {
  keywords?: string;
  category?: string;
  province?: string;
  date?: "today" | "week" | "month";
  min_price?: number;
  max_price?: number;
  condition?: string;
  order_by?: "closest" | "most_relevance" | "price_asc" | "price_desc";
};

export type SearchPageParams = {
  keywords?: string;
  category?: string;
  province?: string;
  date?: string;
  min_price?: string;
  max_price?: string;
  condition?: string;
  order_by?: string;
};

function getDateFilter(date?: string): string | null {
  if (!date) return null;
  const now = new Date();
  if (date === "today") {
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  }
  if (date === "week") {
    now.setDate(now.getDate() - 7);
    return now.toISOString();
  }
  if (date === "month") {
    now.setDate(now.getDate() - 30);
    return now.toISOString();
  }
  return null;
}

export async function searchItems(params: SearchParams) {
  const supabase = await createClient();

  let q = supabase
    .from("items")
    .select("*, profiles(name, avatar_url, rating)")
    .eq("available", true)
    .eq("sold", false);

  if (params.keywords) q = q.ilike("title", `%${params.keywords}%`);
  if (params.category) q = q.eq("category", params.category);
  if (params.province) q = q.eq("province", params.province);
  if (params.condition) q = q.eq("condition", params.condition);
  if (params.min_price) q = q.gte("sale_price", params.min_price);
  if (params.max_price) q = q.lte("sale_price", params.max_price);

  const dateFrom = getDateFilter(params.date);
  if (dateFrom) q = q.gte("created_at", dateFrom);

  switch (params.order_by) {
    case "price_asc":
      q = q.order("sale_price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("sale_price", { ascending: false });
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  const { data } = await q;
  return data ?? [];
}

export async function getSearchPageData(
  params: SearchPageParams,
  userId: string | null,
) {
  const [items, favoriteIds] = await Promise.all([
    searchItems({
      keywords: params.keywords,
      category: params.category,
      province: params.province,
      date: params.date as "today" | "week" | "month" | undefined,
      min_price: params.min_price ? Number(params.min_price) : undefined,
      max_price: params.max_price ? Number(params.max_price) : undefined,
      condition: params.condition,
      order_by: params.order_by as
        | "closest"
        | "most_relevance"
        | "price_asc"
        | "price_desc"
        | undefined,
    }),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

  const categoryLabel = params.category
    ? CATEGORIES.find((c) => c.id === params.category)?.label
    : null;

  const title =
    categoryLabel ??
    (params.keywords
      ? `Resultados para "${params.keywords}"`
      : "Todos los artículos");

  return { items, favoriteIds, title };
}
