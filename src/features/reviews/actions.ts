"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/features/notifications/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ReviewWithReviewer, PurchaseWithRelations } from "./types";
import { ReviewSchema } from "./schemas";

export async function getReviewsByProfile(
  profileId: string,
): Promise<ReviewWithReviewer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)")
    .eq("reviewed_id", profileId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ReviewWithReviewer[];
}

export async function hasReviewedPurchase(
  purchaseId: string,
): Promise<boolean> {
  const { supabase, user } = await getAuthUser();
  if (!user) return false;

  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("purchase_id", purchaseId)
    .eq("reviewer_id", user.id)
    .single();

  return !!data;
}

export async function getPendingReviews() {
  const { supabase, user } = await getAuthUser();
  if (!user) return [];

  const { data: purchases } = await supabase
    .from("purchases")
    .select(
      "id, item_id, buyer_id, owner_id, items(title, images), buyer:profiles!purchases_buyer_id_fkey(id, name), owner:profiles!purchases_owner_id_fkey(id, name)",
    )
    .or(`buyer_id.eq.${user.id},owner_id.eq.${user.id}`)
    .eq("status", "completed");

  if (!purchases?.length) return [];

  const { data: myReviews } = await supabase
    .from("reviews")
    .select("purchase_id")
    .eq("reviewer_id", user.id);

  const reviewedPurchaseIds = new Set(
    myReviews?.map((r: { purchase_id: string }) => r.purchase_id) ?? [],
  );

  return (purchases as unknown as PurchaseWithRelations[])
    .filter((p) => !reviewedPurchaseIds.has(p.id))
    .map((p) => {
      const isBuyer = p.buyer_id === user.id;
      const reviewedId = isBuyer ? p.owner_id : p.buyer_id;
      const reviewedRaw = isBuyer ? p.owner : p.buyer; // ← sin [0]
      const itemTitle =
        (p.items as { title: string } | null)?.title ?? "este artículo";

      return {
        ...p,
        myRole: isBuyer ? "buyer" : "seller",
        reviewedId,
        reviewedName: reviewedRaw?.name ?? "el usuario",
        itemTitle, // ← agregalo acá directamente
      };
    });
}

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

export type PendingReview = Awaited<
  ReturnType<typeof getPendingReviews>
>[number];
