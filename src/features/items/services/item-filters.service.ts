// features/items/services/item-filters.service.ts

type DateFilter = "today" | "week" | "month";

export function getDateFrom(date?: DateFilter): string | null {
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

export function applyItemFilters(query: any, params: GetItemsParams) {
  if (params.query) query = query.ilike("title", `%${params.query}%`);
  if (params.category) query = query.eq("category", params.category);
  if (params.city) query = query.ilike("city", `%${params.city}%`);
  if (params.province) query = query.eq("province", params.province);
  if (params.type) query = query.eq("type", params.type);
  if (params.condition) query = query.eq("condition", params.condition);
  if (params.min_price) query = query.gte("sale_price", params.min_price);
  if (params.max_price) query = query.lte("sale_price", params.max_price);

  const dateFrom = getDateFrom(params.date);
  if (dateFrom) query = query.gte("created_at", dateFrom);

  return query;
}

export function applyItemSorting(query: any, orderBy?: string) {
  switch (orderBy) {
    case "price_asc":
      return query.order("sale_price", { ascending: true });
    case "price_desc":
      return query.order("sale_price", { ascending: false });
    default:
      return query.order("created_at", { ascending: false });
  }
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
  date?: "today" | "week" | "month";
  order_by?: "closest" | "most_relevance" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}
