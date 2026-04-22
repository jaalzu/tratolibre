"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SORT_LABELS, FILTER_QUERY_KEYS } from "../constants";
import { SortOrder } from "../types";

export function useSearchFilterBar() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const searchParams = useSearchParams();

  const orderBy = (searchParams.get("order_by") as SortOrder) ?? "closest";

  // Usamos la constante para chequear si hay filtros activos
  const hasFilters = FILTER_QUERY_KEYS.some((key) => searchParams.has(key));

  const currentSortLabel = SORT_LABELS[orderBy];

  return {
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,
    hasFilters,
    currentSortLabel,
  };
}
