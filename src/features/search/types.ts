// features/search/types.ts

// 1. Tipos base y literales
export type SortOrder =
  | "closest"
  | "most_relevance"
  | "price_asc"
  | "price_desc";
export type DateFilter = "today" | "week" | "month";

// 2. Tipos para la Base de Datos / Services
export interface SearchParams {
  keywords?: string;
  category?: string;
  province?: string;
  date?: DateFilter;
  min_price?: number;
  max_price?: number;
  condition?: string;
  order_by?: SortOrder;
}

// 3. Tipos para las URLs / Actions
export interface SearchPageParams {
  keywords?: string;
  category?: string;
  province?: string;
  date?: string;
  min_price?: string;
  max_price?: string;
  condition?: string;
  order_by?: string;
}

// 4. Tipos para el Estado del Cliente / Hooks
export interface SearchFilters {
  category: string;
  province: string;
  date: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  orderBy: string;
}

// 5. Entidades externas
export interface Province {
  id: string;
  nombre: string;
}

// 6. Tipos para la UI (ej: SortModal)
export interface SortOption {
  id: SortOrder;
  label: string;
}
