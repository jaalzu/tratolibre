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
    queryFn: ({ pageParam = 0 }) =>
      getItems({
        ...options?.params,
        page: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: 0,
    enabled: options?.enabled ?? true,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
  });
}
