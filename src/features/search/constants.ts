// features/search/constants.ts
import { SearchFilters, SortOption, SortOrder } from "./types";

export const SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "Más recientes" },
  { id: "price_asc", label: "Menor precio" },
  { id: "price_desc", label: "Mayor precio" },
  { id: "oldest", label: "Más antiguos" },
];

export const SORT_LABELS: Record<SortOrder, string> = {
  newest: "Más recientes",
  oldest: "Más antiguos",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
};

export const DATE_OPTIONS = [
  { id: "today", label: "Hoy" },
  { id: "week", label: "Últimos 7 días" },
  { id: "month", label: "Últimos 30 días" },
];

export const FILTER_MAPPING: Record<keyof SearchFilters, string> = {
  category: "category",
  province: "province",
  date: "date",
  condition: "condition",
  minPrice: "min_price",
  maxPrice: "max_price",
  orderBy: "order_by",
};

export const INITIAL_FILTERS: SearchFilters = {
  category: "",
  province: "",
  date: "",
  condition: "",
  minPrice: "",
  maxPrice: "",
  orderBy: "newest",
};

// ✅ NUEVO: Array de keys para chequear filtros activos
export const FILTER_QUERY_KEYS = Object.values(FILTER_MAPPING);
