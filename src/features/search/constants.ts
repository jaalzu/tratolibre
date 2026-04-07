import { SearchFilters, SortOption, SortOrder } from "./types";

export const SORT_OPTIONS: SortOption[] = [
  { id: "closest", label: "Más recientes" },
  { id: "most_relevance", label: "Más relevantes" },
  { id: "price_asc", label: "Menor precio" },
  { id: "price_desc", label: "Mayor precio" },
];

export const SORT_LABELS: Record<SortOrder, string> = {
  closest: "Más recientes",
  most_relevance: "Más relevantes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
};

export const DATE_OPTIONS = [
  { id: "today", label: "Hoy" },
  { id: "week", label: "Últimos 7 días" },
  { id: "month", label: "Últimos 30 días" },
];

// Mapeo de la propiedad del State -> Query Param de la URL
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
  orderBy: "closest",
};

// Esto reemplaza tu antiguo FILTER_QUERY_KEYS para ser más dinámico
export const FILTER_QUERY_KEYS = Object.values(FILTER_MAPPING);
