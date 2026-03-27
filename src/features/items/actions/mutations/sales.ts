"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/features/notifications/actions";

async function updateItemAsSold(
  supabase: any,
  itemId: string,
  ownerId: string,
) {
  const { error } = await supabase
    .from("items")
    .update({ sold: true, available: false, sold_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("owner_id", ownerId);
  return error;
}

async function createPurchaseRecord(
  supabase: any,
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
) {
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
  return { data, error };
}

async function notifySaleCompleted(
  itemId: string,
  itemTitle: string,
  ownerId: string,
  buyerId: string,
  purchaseId: string,
) {
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
}

export async function markAsSoldToAction(itemId: string, buyerId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { data: item } = await supabase
    .from("items")
    .select("sale_price, title")
    .eq("id", itemId)
    .eq("owner_id", user.id)
    .single();

  if (!item) return { error: "Item no encontrado" };

  const itemError = await updateItemAsSold(supabase, itemId, user.id);
  if (itemError) return { error: itemError.message };

  const { data: purchase, error: purchaseError } = await createPurchaseRecord(
    supabase,
    {
      itemId,
      buyerId,
      ownerId: user.id,
      salePrice: item.sale_price,
    },
  );
  if (purchaseError) return { error: purchaseError.message };

  await notifySaleCompleted(itemId, item.title, user.id, buyerId, purchase.id);

  revalidatePath(`/item/${itemId}`);
  revalidatePath("/profile");

  return { success: true, purchaseId: purchase.id };
}
