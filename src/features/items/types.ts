import { Database } from "@/lib/supabase/database.types";
import { BaseSearchParams } from "@/features/search/types";

// Base types de DB
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

// Extended types
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
