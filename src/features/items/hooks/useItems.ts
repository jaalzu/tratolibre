"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";
import type { GetItemsParams } from "@/features/items/services/item-filters.service";

const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 10 * 60 * 1000; // 10 min

export function useItems(params: GetItemsParams = {}) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: async () => {
      const result = await getItems(params);

      // ✅ Desempaquetar el Result y lanzar error si falla
      if (!result.success) {
        throw new Error(
          result.error.type === "database"
            ? result.error.message
            : "Error cargando items",
        );
      }

      // ✅ Retornar solo los datos
      return result.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
