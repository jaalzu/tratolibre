import { SupabaseClient } from "@supabase/supabase-js";
import {
  ItemInsert,
  ItemUpdateData,
  Item,
  ItemCreateResult,
  ItemUpdateResult,
  ItemDeleteResult,
} from "../types";
import { mapSupabaseToItemError } from "./item-error.mapper";

// ============================================
// CREATE ITEM
// ============================================

export async function createItem(
  supabase: SupabaseClient,
  data: ItemInsert,
): ItemCreateResult {
  try {
    const { data: item, error } = await supabase
      .from("items")
      .insert(data)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "createItem"),
      };
    }

    if (!item) {
      return {
        success: false,
        error: {
          type: "unknown",
          message: "No se pudo crear el item",
        },
      };
    }

    return {
      success: true,
      data: item as Item,
    };
  } catch (error) {
    console.error("Error crítico en createItem:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "createItem"),
    };
  }
}

// ============================================
// UPDATE ITEM
// ============================================

export async function updateItem(
  supabase: SupabaseClient,
  id: string,
  ownerId: string,
  data: ItemUpdateData,
): ItemUpdateResult {
  try {
    const { error } = await supabase
      .from("items")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("owner_id", ownerId);

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "updateItem"),
      };
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error crítico en updateItem:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "updateItem"),
    };
  }
}

// ============================================
// DELETE ITEM
// ============================================

export async function deleteItem(
  supabase: SupabaseClient,
  id: string,
  ownerId: string,
): ItemDeleteResult {
  try {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("owner_id", ownerId);

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "deleteItem"),
      };
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error crítico en deleteItem:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "deleteItem"),
    };
  }
}
