"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";

const LIMIT = 4;

export function useInfiniteItems() {
  return useInfiniteQuery({
    queryKey: ["items-infinite"],
    queryFn: ({ pageParam = 0 }) => getItems({ page: pageParam, limit: LIMIT }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined; // no hay más
      return allPages.length;
    },
  });
}
