import { SupabaseClient } from "@supabase/supabase-js";
import {
  ItemInsert,
  ItemUpdateData,
  Item,
  ItemWithProfile,
  ItemCreateResult,
  ItemUpdateResult,
  ItemDeleteResult,
  ItemsListResult,
  ItemSearchParams,
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

// ============================================
// GET ITEMS (con filtros y búsqueda)
// ============================================

// export async function getItems(
//   supabase: SupabaseClient,
//   params: ItemSearchParams = {},
// ): ItemsListResult {
//   try {
//     let query = supabase
//       .from("items")
//       .select("*, profiles(name, avatar_url, rating)")
//       .eq("available", true)
//       .eq("sold", false);

//     // Aplicar filtros
//     if (params.keywords) {
//       query = query.ilike("title", `%${params.keywords}%`);
//     }
//     if (params.category) {
//       query = query.eq("category", params.category);
//     }
//     if (params.province) {
//       query = query.eq("province", params.province);
//     }
//     if (params.min_price) {
//       query = query.gte("sale_price", Number(params.min_price));
//     }
//     if (params.max_price) {
//       query = query.lte("sale_price", Number(params.max_price));
//     }
//     if (params.condition) {
//       query = query.eq("condition", params.condition);
//     }

//     // Aplicar ordenamiento
//     const orderBy = params.order_by ?? "newest";
//     switch (orderBy) {
//       case "price_desc":
//         query = query.order("sale_price", { ascending: false });
//         break;
//       case "price_asc":
//         query = query.order("sale_price", { ascending: true });
//         break;
//       case "oldest":
//         query = query.order("created_at", { ascending: true });
//         break;
//       case "newest":
//       default:
//         query = query.order("created_at", { ascending: false });
//     }

//     const { data, error } = await query;

//     if (error) {
//       return {
//         success: false,
//         error: mapSupabaseToItemError(error, "getItems"),
//       };
//     }

//     return {
//       success: true,
//       data: (data ?? []) as ItemWithProfile[],
//     };
//   } catch (error) {
//     console.error("Error crítico en getItems:", error);
//     return {
//       success: false,
//       error: mapSupabaseToItemError(error, "getItems"),
//     };
//   }
// }
