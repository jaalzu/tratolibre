"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/features/notifications/actions";
import {
  getItemForSale,
  markItemAsSold,
  createPurchase,
} from "../../services/sales-service";

async function notifySaleCompleted(
  itemId: string,
  itemTitle: string,
  ownerId: string,
  buyerId: string,
  purchaseId: string,
) {
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
  }
}

export async function markAsSoldToAction(itemId: string, buyerId: string) {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const item = await getItemForSale(supabase, itemId, user.id);
    if (!item) return { error: "Item no encontrado" };

    const { error: itemError } = await markItemAsSold(
      supabase,
      itemId,
      user.id,
    );
    if (itemError) return { error: itemError.message };

    const { data: purchase, error: purchaseError } = await createPurchase(
      supabase,
      {
        itemId,
        buyerId,
        ownerId: user.id,
        salePrice: item.sale_price,
      },
    );
    if (purchaseError) return { error: purchaseError.message };

    await notifySaleCompleted(
      itemId,
      item.title,
      user.id,
      buyerId,
      purchase!.id,
    );

    revalidatePath(`/item/${itemId}`);
    revalidatePath("/profile");

    return { success: true, purchaseId: purchase!.id };
  } catch (error) {
    console.error("Error crítico en markAsSoldToAction:", error);
    return { error: "Ocurrió un error inesperado al procesar la venta" };
  }
}
