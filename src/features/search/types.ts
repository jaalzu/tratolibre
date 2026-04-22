// ===================================
// 1. LITERALES Y UNIONS
// ===================================
export type SortOrder = "price_asc" | "price_desc" | "oldest" | "newest";
export type DateFilter = "today" | "week" | "month";
export type Condition = "new" | "like_new" | "good" | "fair";

// ===================================
// 2. TIPOS BASE (Source of Truth)
// ===================================
export interface BaseSearchParams {
  keywords?: string;
  category?: string;
  province?: string;
  date?: DateFilter;
  min_price?: number;
  max_price?: number;
  condition?: Condition;
  order_by?: SortOrder;
}

// ===================================
// 3. TIPOS DERIVADOS
// ===================================

export type SearchPageParams = {
  [K in keyof BaseSearchParams]: string | undefined;
};

export type SearchServiceParams = BaseSearchParams;

export interface SearchFilters {
  category: string;
  province: string;
  date: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  orderBy: string;
}

// ===================================
// 4. ENTIDADES EXTERNAS
// ===================================
export interface Province {
  id: string;
  nombre: string;
}

// ===================================
// 5. UI HELPERS
// ===================================
export interface SortOption {
  id: SortOrder;
  label: string;
}
