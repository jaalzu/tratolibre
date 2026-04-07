"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SortOrder } from "../types";

export function useSortNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentOrder = (searchParams.get("order_by") as SortOrder) ?? "closest";

  const handleSortChange = (id: SortOrder, onClose: () => void) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order_by", id);
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  return { currentOrder, handleSortChange };
}
