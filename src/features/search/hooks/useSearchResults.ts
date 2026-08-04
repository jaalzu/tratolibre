"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { CATEGORIES } from "@/lib/constants";

export function useSearchResults(params: any) {
  const itemsParams = {
    query: params.keywords || "",
    category: params.category,
    province: params.province,
    condition: params.condition,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    order_by: params.order_by,
  };

  const { data, isLoading } = useItems(itemsParams);

  const items = Array.isArray(data) ? data : [];

  const categoryLabel = params.category
    ? CATEGORIES.find((c: any) => c.id === params.category)?.label
    : null;

  return {
    items,
    isLoading,
    count: items.length,
    title:
      categoryLabel ||
      (params.keywords
        ? `Resultados para "${params.keywords}"`
        : "Todos los articulos"),
  };
}
