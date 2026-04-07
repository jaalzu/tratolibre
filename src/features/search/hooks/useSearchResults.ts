// features/search/hooks/use-search-results.ts
"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { CATEGORIES } from "@/lib/constants";

export function useSearchResults(params: any) {
  const itemsParams = {
    // CAMBIO: Asegurate de usar 'keywords' que es lo que espera tu service
    keywords: params.keywords || "",
    category: params.category,
    province: params.province,
    condition: params.condition,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    // ¡ESTO FALTA! Sin esto, el ordenamiento nunca llega al service
    order_by: params.order_by,
  };

  // Ahora useItems recibe un objeto que SI tiene el order_by
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
        : "Todos los artículos"),
  };
}
