"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";
import type { GetItemsParams } from "@/features/items/services/item-filters.service";

const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 10 * 60 * 1000; // 10 min

export function useItems(params: GetItemsParams = {}) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => getItems(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
