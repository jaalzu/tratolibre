import { Database } from "@/lib/supabase/database.types";
import { BaseSearchParams } from "@/features/search/types";

// ============================================
// BASE TYPES DE DB (lo que ya tenías)
// ============================================
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type FavoriteInsert =
  Database["public"]["Tables"]["favorites"]["Insert"];

export type Purchase = Database["public"]["Tables"]["purchases"]["Row"];
export type PurchaseInsert =
  Database["public"]["Tables"]["purchases"]["Insert"];

export type EditableItemFields = Pick<
  Item,
  | "title"
  | "description"
  | "category"
  | "condition"
  | "sale_price"
  | "province"
  | "city"
  | "location"
  | "images"
>;

export type ItemSearchParams = BaseSearchParams;
export type ItemUpdateData = Partial<EditableItemFields>;

// ============================================
// EXTENDED TYPES (lo que ya tenías)
// ============================================
export interface ItemWithProfile extends Item {
  profiles: {
    id: string;
    name: string;
    avatar_url: string;
    rating: number;
    reviews_count: number;
  } | null;
}

export interface ItemWithOwner extends Item {
  profiles: {
    id: string;
    name: string;
    avatar_url: string;
    rating: number;
  } | null;
}

export interface ItemSummary {
  id: string;
  title: string;
  sale_price: number;
  images: string[] | null;
  sold: boolean;
}

// ============================================
// RESULT TYPES - Discriminated Unions (NUEVO)
// ============================================

/**
 * Result type genérico para operaciones que pueden fallar
 */
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async Result - para operaciones asíncronas
 */
export type AsyncResult<T, E = string> = Promise<Result<T, E>>;

// ============================================
// ERROR TYPES - Tipos específicos de errores (NUEVO)
// ============================================

export type ItemError =
  | { type: "unauthorized"; message: string }
  | { type: "not_found"; message: string }
  | { type: "validation"; message: string; fields?: Record<string, string[]> }
  | { type: "rate_limit"; message: string; retryAfter?: number }
  | { type: "database"; message: string; code?: string }
  | { type: "unknown"; message: string };

// ============================================
// OPERATION RESULTS - Tipos específicos (NUEVO)
// ============================================

export type ItemCreateResult = AsyncResult<Item, ItemError>;
export type ItemUpdateResult = AsyncResult<void, ItemError>;
export type ItemDeleteResult = AsyncResult<void, ItemError>;
export type ItemFetchResult = AsyncResult<Item, ItemError>;
export type ItemListResult = AsyncResult<Item[], ItemError>;

export type SaleResult = AsyncResult<{ purchaseId: string }, ItemError>;

export type ItemWithProfileResult = AsyncResult<
  ItemWithProfile | null,
  ItemError
>;
export type ItemsListResult = AsyncResult<ItemWithProfile[], ItemError>;
export type FavoritesListResult = AsyncResult<Item[], ItemError>;
export type FavoriteIdsResult = AsyncResult<string[], ItemError>;
