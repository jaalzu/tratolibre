// features/items/types.ts

import { Database } from "@/lib/supabase/database.types";

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

// Form data types
export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  sale_price: string; // raw form value
  province: string;
  city?: string;
  location?: string;
  type: string;
  images: string[];
}
