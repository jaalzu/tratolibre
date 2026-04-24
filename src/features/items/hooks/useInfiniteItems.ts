"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";
import type { GetItemsParams } from "@/features/items/services/item-filters.service";

const LIMIT = 4;

interface UseInfiniteItemsOptions {
  enabled?: boolean;
  params?: Omit<GetItemsParams, "page" | "limit">;
}

export function useInfiniteItems(options?: UseInfiniteItemsOptions) {
  return useInfiniteQuery({
    queryKey: ["items-infinite", options?.params],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getItems({
        ...options?.params,
        page: pageParam,
        limit: LIMIT,
      });

      // ✅ Lanzar error si falla - React Query lo maneja
      if (!result.success) {
        throw new Error(
          result.error.type === "database"
            ? result.error.message
            : "Error cargando items",
        );
      }

      return result.data;
    },
    initialPageParam: 0,
    enabled: options?.enabled ?? true,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
  });
}
