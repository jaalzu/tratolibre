"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";

const LIMIT = 4;

// Ahora acepta un objeto de opciones para el enabled
export function useInfiniteItems(options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: ["items-infinite"],
    queryFn: ({ pageParam = 0 }) => getItems({ page: pageParam, limit: LIMIT }),
    initialPageParam: 0,
    enabled: options?.enabled ?? true, // Si es false, no dispara el fetch
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
  });
}
