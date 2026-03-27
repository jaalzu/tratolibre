"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/features/notifications/actions";
import { ReviewSchema } from "../schemas";

export async function submitReviewAction(input: {
  purchase_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  role: "buyer" | "seller";
}) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const parsed = ReviewSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos" };

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, buyer_id, owner_id, items(title)")
    .eq("id", parsed.data.purchase_id)
    .single();

  if (!purchase) return { error: "Compra no encontrada" };

  const isPartOfPurchase =
    purchase.buyer_id === user.id || purchase.owner_id === user.id;
  if (!isPartOfPurchase) return { error: "No autorizado" };

  const validReviewedId =
    (user.id === purchase.buyer_id &&
      parsed.data.reviewed_id === purchase.owner_id) ||
    (user.id === purchase.owner_id &&
      parsed.data.reviewed_id === purchase.buyer_id);
  if (!validReviewedId) return { error: "Reseña inválida" };

  const { error } = await supabase.from("reviews").insert({
    purchase_id: parsed.data.purchase_id,
    reviewer_id: user.id,
    reviewed_id: parsed.data.reviewed_id,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
    role: parsed.data.role,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "Ya dejaste una reseña para esta compra" };
    return { error: error.message };
  }

  const itemTitle =
    (purchase.items as { title: string }[] | null)?.[0]?.title ?? "un artículo";

  await createNotification({
    userId: parsed.data.reviewed_id,
    type: "review_received",
    data: {
      reviewer_id: user.id,
      rating: parsed.data.rating,
      purchase_id: parsed.data.purchase_id,
      item_title: itemTitle,
    },
  });

  revalidatePath(`/profile/${parsed.data.reviewed_id}`);
  return { success: true };
}
