import { SupabaseClient } from "@supabase/supabase-js";
import { ItemError, AsyncResult } from "../types";
import { mapSupabaseToItemError } from "./item-error.mapper";

// ============================================
// TYPES - Resultados específicos de ventas
// ============================================

type SaleItemData = {
  sale_price: number;
  title: string;
};

type PurchaseData = {
  id: string;
  item_id: string;
  buyer_id: string;
  owner_id: string;
  sale_price: number;
  status: string;
};

type GetItemForSaleResult = AsyncResult<SaleItemData, ItemError>;
type MarkAsSoldResult = AsyncResult<void, ItemError>;
type CreatePurchaseResult = AsyncResult<PurchaseData, ItemError>;

// ============================================
// GET ITEM FOR SALE
// ============================================

export async function getItemForSale(
  supabase: SupabaseClient,
  itemId: string,
  ownerId: string,
): GetItemForSaleResult {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("sale_price, title")
      .eq("id", itemId)
      .eq("owner_id", ownerId)
      .single();

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "getItemForSale"),
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          type: "not_found",
          message: "Item no encontrado",
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error crítico en getItemForSale:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "getItemForSale"),
    };
  }
}

// ============================================
// MARK ITEM AS SOLD
// ============================================

export async function markItemAsSold(
  supabase: SupabaseClient,
  itemId: string,
  ownerId: string,
): MarkAsSoldResult {
  try {
    const { error } = await supabase
      .from("items")
      .update({
        sold: true,
        available: false,
        sold_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .eq("owner_id", ownerId);

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "markItemAsSold"),
      };
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error crítico en markItemAsSold:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "markItemAsSold"),
    };
  }
}

// ============================================
// CREATE PURCHASE
// ============================================

export async function createPurchase(
  supabase: SupabaseClient,
  {
    itemId,
    buyerId,
    ownerId,
    salePrice,
  }: {
    itemId: string;
    buyerId: string;
    ownerId: string;
    salePrice: number;
  },
): CreatePurchaseResult {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .insert({
        item_id: itemId,
        buyer_id: buyerId,
        owner_id: ownerId,
        sale_price: salePrice,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "createPurchase"),
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          type: "unknown",
          message: "No se pudo crear la compra",
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error crítico en createPurchase:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "createPurchase"),
    };
  }
}
