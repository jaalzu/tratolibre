"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createClient } from "@/lib/supabase/server";
import type { ReviewWithReviewer, PurchaseWithRelations } from "../types";

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
      const reviewedRaw = isBuyer ? p.owner : p.buyer;
      const itemTitle =
        (p.items as { title: string } | null)?.title ?? "este artículo";
      return {
        ...p,
        myRole: isBuyer ? "buyer" : "seller",
        reviewedId,
        reviewedName: reviewedRaw?.name ?? "el usuario",
        itemTitle,
      };
    });
}
