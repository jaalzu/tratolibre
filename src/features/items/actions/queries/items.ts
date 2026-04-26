"use server";

import { createClient } from "@/lib/supabase/server";
import {
  applyItemFilters,
  applyItemSorting,
  type GetItemsParams,
} from "../../services/item-filters.service";
import {
  ItemWithProfile,
  ItemWithProfileResult,
  ItemsListResult,
} from "../../types";
import { mapSupabaseToItemError } from "../../services/item-error.mapper";

// ============================================
// GET ITEM BY ID
// ============================================

export async function getItemById(id: string): ItemWithProfileResult {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("items")
      .select("*, profiles(id, name, avatar_url, rating, reviews_count)")
      .eq("id", id)
      .single();

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "getItemById"),
      };
    }

    // Supabase puede retornar null si no encuentra nada
    if (!data) {
      return {
        success: false,
        error: {
          type: "not_found",
          message: "El item no fue encontrado",
        },
      };
    }

    return {
      success: true,
      data: data as ItemWithProfile,
    };
  } catch (error) {
    console.error(`Error crítico en getItemById ${id}:`, error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "getItemById"),
    };
  }
}

// ============================================
// GET ITEMS (con filtros y paginación)
// ============================================

export async function getItems(params: GetItemsParams = {}): ItemsListResult {
  try {
    const supabase = await createClient();

    const limit = params.limit ?? 12;
    const page = params.page ?? 0;
    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("items")
      .select("*, profiles(name, avatar_url, rating)")
      .eq("available", true)
      .eq("sold", false)
      .range(from, to);

    query = applyItemFilters(query, params);
    query = applyItemSorting(query, params.order_by);

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "getItems"),
      };
    }

    return {
      success: true,
      data: (data ?? []) as ItemWithProfile[],
    };
  } catch (error) {
    console.error("Error crítico en getItems:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "getItems"),
    };
  }
}
