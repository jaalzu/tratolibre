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
  try {
    const supabase = await createClient();

    // Validación de números con fallback
    const minPrice = params.min_price ? Number(params.min_price) : undefined;
    const maxPrice = params.max_price ? Number(params.max_price) : undefined;

    // Validar que los números sean válidos
    if (params.min_price && isNaN(minPrice!)) {
      return {
        items: [],
        favoriteIds: [],
        title: "Error en los parámetros de búsqueda",
        error: "Precio mínimo inválido",
      };
    }

    if (params.max_price && isNaN(maxPrice!)) {
      return {
        items: [],
        favoriteIds: [],
        title: "Error en los parámetros de búsqueda",
        error: "Precio máximo inválido",
      };
    }

    const serviceParams: SearchParams = {
      keywords: params.keywords,
      category: params.category,
      province: params.province,
      date: params.date as DateFilter | undefined,
      min_price: minPrice,
      max_price: maxPrice,
      condition: params.condition,
      order_by: params.order_by as SortOrder | undefined,
    };

    // Promise.all con manejo de errores individual
    const [itemsResult, favoriteIds] = await Promise.all([
      getSearchItemsService(supabase, serviceParams),
      userId
        ? getUserFavoriteIds(userId).catch(() => []) // Si falla, devuelve array vacío
        : Promise.resolve([]),
    ]);

    const categoryLabel = params.category
      ? CATEGORIES.find((c) => c.id === params.category)?.label
      : null;

    const title =
      categoryLabel ??
      (params.keywords
        ? `Resultados para "${params.keywords}"`
        : "Todos los artículos");

    return {
      items: itemsResult.data ?? [],
      favoriteIds,
      title,
      error: itemsResult.error,
    };
  } catch (error) {
    console.error("Error in getSearchPageDataAction:", error);

    return {
      items: [],
      favoriteIds: [],
      title: "Error al cargar resultados",
      error:
        error instanceof Error ? error.message : "Ocurrió un error inesperado",
    };
  }
}
