"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters } from "../types";
// Importamos el hook especialista
import { useProvinces } from "./useProvinces";
import {
  INITIAL_FILTERS,
  FILTER_MAPPING,
  FILTER_QUERY_KEYS,
} from "../constants";
import { buildFilterQuery } from "../utils/filter-utils";

export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Delegamos la carga de provincias al hook especialista
  // Ya no necesitamos useEffect ni setProvinces acá.
  const { provinces, isLoading: isLoadingProvinces } = useProvinces();

  // 2. Estado de filtros (se mantiene igual)
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const state = { ...INITIAL_FILTERS };
    (Object.keys(INITIAL_FILTERS) as Array<keyof SearchFilters>).forEach(
      (key) => {
        const urlKey = FILTER_MAPPING[key];
        const value = searchParams.get(urlKey);
        if (value) state[key] = value;
      },
    );
    return state;
  });

  const setFilter = (key: keyof SearchFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleFilter = (key: keyof SearchFilters, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));

  const apply = (onClose?: unknown) => {
    const query = buildFilterQuery(filters, searchParams.toString());
    router.push(`/search?${query}`);
    if (typeof onClose === "function") onClose();
  };

  const clear = (onClose?: unknown) => {
    setFilters(INITIAL_FILTERS);
    const keywords = searchParams.get("keywords");
    router.push(`/search${keywords ? `?keywords=${keywords}` : ""}`);
    if (typeof onClose === "function") onClose();
  };

  const hasFilters = FILTER_QUERY_KEYS.some((k) => searchParams.has(k));

  return {
    filters,
    setFilter,
    toggleFilter,
    apply,
    clear,
    hasFilters,
    provinces,
    isLoadingProvinces,
  };
}
