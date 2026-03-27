"use server";

import { createClient } from "@/lib/supabase/server";

type DateFilter = "today" | "week" | "month";

function getDateFrom(date?: DateFilter): string | null {
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

export interface GetItemsParams {
  query?: string;
  category?: string;
  city?: string;
  province?: string;
  type?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  date?: DateFilter;
  order_by?: "closest" | "most_relevance" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export async function getItems(params: GetItemsParams = {}) {
  const supabase = await createClient();
  const limit = params.limit ?? 12;
  const page = params.page ?? 0;
  const from = page * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("items")
    .select("*, profiles(name, avatar_url, rating)")
    .eq("available", true)
    .eq("sold", false)
    .range(from, to);

  if (params.query) q = q.ilike("title", `%${params.query}%`);
  if (params.category) q = q.eq("category", params.category);
  if (params.city) q = q.ilike("city", `%${params.city}%`);
  if (params.province) q = q.eq("province", params.province);
  if (params.type) q = q.eq("type", params.type);
  if (params.condition) q = q.eq("condition", params.condition);
  if (params.min_price) q = q.gte("sale_price", params.min_price);
  if (params.max_price) q = q.lte("sale_price", params.max_price);

  const dateFrom = getDateFrom(params.date);
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
