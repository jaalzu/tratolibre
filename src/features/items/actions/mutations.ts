"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { ItemSchema } from "../schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import { createNotification } from "@/features/notifications/actions";

type ActionState = { error?: string | object } | null;

export async function createItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const allowed = await checkRateLimit(supabase, user.id, "create_item", 8, 60);
  if (!allowed)
    return {
      error:
        "Alcanzaste el límite de 8 publicaciones por hora. Intentá más tarde.",
    };

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    sale_price: formData.get("sale_price"),
    province: formData.get("province"),
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    type: formData.get("type"),
    images: formData.getAll("images") as string[],
  };

  const parsed = ItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { data: item, error } = await supabase
    .from("items")
    .insert({ ...parsed.data, owner_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/item/${item.id}`);
}

export async function updateItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const id = formData.get("id") as string;

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    sale_price: formData.get("sale_price"),
    province: formData.get("province"),
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    type: formData.get("type"),
    images: formData.getAll("images") as string[],
  };

  const parsed = ItemSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { error } = await supabase
    .from("items")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/item/${id}`);
  redirect(`/item/${id}`);
}

export async function deleteItemAction(id: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}

export async function toggleFavoriteAction(itemId: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return { favorited: false };
  }

  await supabase
    .from("favorites")
    .insert({ user_id: user.id, item_id: itemId });
  return { favorited: true };
}

// privadas — no se exportan
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

// pública — orquesta
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
