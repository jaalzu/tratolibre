"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/features/notifications";
import {
  getItemForSale,
  markItemAsSold,
  createPurchase,
} from "../../services/sales-service";
import { itemErrorToMessage } from "../../services/item-error.mapper";

// ============================================
// TYPES
// ============================================

type SaleActionResult =
  | { success: true; data: { purchaseId: string } }
  | { success: false; error: string };

// ============================================
// HELPERS
// ============================================

async function notifySaleCompleted(
  itemId: string,
  itemTitle: string,
  ownerId: string,
  buyerId: string,
  purchaseId: string,
): Promise<void> {
  try {
    await Promise.all([
      createNotification({
        userId: ownerId,
        type: "sale_completed",
        data: {
          item_id: itemId,
          item_title: itemTitle,
          buyer_id: buyerId,
          purchase_id: purchaseId,
        },
      }),
      createNotification({
        userId: buyerId,
        type: "purchase_completed",
        data: {
          item_id: itemId,
          item_title: itemTitle,
          owner_id: ownerId,
          purchase_id: purchaseId,
        },
      }),
    ]);
  } catch (error) {
    console.error("Error enviando notificaciones de venta:", error);
    // No propagamos el error - las notificaciones son no críticas
  }
}

// ============================================
// MARK AS SOLD ACTION
// ============================================

export async function markAsSoldToAction(
  itemId: string,
  buyerId: string,
): Promise<SaleActionResult> {
  try {
    // 1. Autenticación
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Obtener item para venta
    const itemResult = await getItemForSale(supabase, itemId, user.id);
    if (!itemResult.success) {
      return {
        success: false,
        error: itemErrorToMessage(itemResult.error),
      };
    }

    // 3. Marcar como vendido
    const soldResult = await markItemAsSold(supabase, itemId, user.id);
    if (!soldResult.success) {
      return {
        success: false,
        error: itemErrorToMessage(soldResult.error),
      };
    }

    // 4. Crear registro de compra
    const purchaseResult = await createPurchase(supabase, {
      itemId,
      buyerId,
      ownerId: user.id,
      salePrice: itemResult.data.sale_price,
    });

    if (!purchaseResult.success) {
      // Intentar revertir el sold=true si falla la compra
      await markItemAsSold(supabase, itemId, user.id); // Idealmente tendríamos un rollback
      return {
        success: false,
        error: itemErrorToMessage(purchaseResult.error),
      };
    }

    // 5. Notificar (no bloqueante)
    await notifySaleCompleted(
      itemId,
      itemResult.data.title,
      user.id,
      buyerId,
      purchaseResult.data.id,
    );

    // 6. Revalidar paths
    revalidatePath(`/item/${itemId}`);
    revalidatePath("/profile");

    return {
      success: true,
      data: { purchaseId: purchaseResult.data.id },
    };
  } catch (error) {
    console.error("Error crítico en markAsSoldToAction:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al procesar la venta",
    };
  }
}
