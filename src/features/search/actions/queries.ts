"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserFavoriteIds } from "@/features/items/actions";
import { CATEGORIES } from "@/lib/constants";
import { getSearchItemsService } from "../services/search-service";
import {
  SearchPageParams,
  SearchParams,
  DateFilter,
  SortOrder,
} from "../types";

export async function getSearchPageDataAction(
  params: SearchPageParams,
  userId: string | null,
) {
  const supabase = await createClient();

  // 1. Mapeo y validación de tipos (String URL -> Types reales)
  const serviceParams: SearchParams = {
    keywords: params.keywords,
    category: params.category,
    province: params.province,
    date: params.date as DateFilter | undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    condition: params.condition,
    order_by: params.order_by as SortOrder | undefined,
  };

  // 2. Ejecución paralela de servicios
  const [itemsResult, favoriteIds] = await Promise.all([
    getSearchItemsService(supabase, serviceParams),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

  // 3. Lógica de UI (Títulos y labels)
  const categoryLabel = params.category
    ? CATEGORIES.find((c) => c.id === params.category)?.label
    : null;

  const title =
    categoryLabel ??
    (params.keywords
      ? `Resultados para "${params.keywords}"`
      : "Todos los artículos");

  return {
    items: itemsResult.data,
    favoriteIds,
    title,
    error: itemsResult.error,
  };
}
