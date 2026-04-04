// features/items/hooks/useItems.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems, GetItemsParams } from "@/features/items/actions";

export function useItems(params: GetItemsParams = {}) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => getItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
  });
}
