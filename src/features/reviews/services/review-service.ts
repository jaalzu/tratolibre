import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReviewInsert, PurchaseWithRelations } from "../types";

type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ==================== Create Review ====================
export async function createReview(
  supabase: SupabaseClient,
  input: ReviewInsert,
): Promise<ServiceResult<{ id: string }>> {
  const { data, error } = await supabase
    .from("reviews")
    .insert(input)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { data: null, error: "Ya dejaste una reseña para esta compra" };
    }
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ==================== Validate Purchase Ownership ====================
export async function validateReviewPermissions(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
  reviewedId: string,
): Promise<
  ServiceResult<{ purchase: PurchaseWithRelations; itemTitle: string }>
> {
  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("*, items(title, images)") // Traer todos los campos de purchase
    .eq("id", purchaseId)
    .single();

  if (error || !purchase) {
    return { data: null, error: "Compra no encontrada" };
  }

  // Verificar que el usuario es parte de la compra
  const isPartOfPurchase =
    purchase.buyer_id === userId || purchase.owner_id === userId;
  if (!isPartOfPurchase) {
    return { data: null, error: "No autorizado" };
  }

  // Verificar que está revieweando a la contraparte correcta
  const validReviewedId =
    (userId === purchase.buyer_id && reviewedId === purchase.owner_id) ||
    (userId === purchase.owner_id && reviewedId === purchase.buyer_id);

  if (!validReviewedId) {
    return { data: null, error: "Reseña inválida" };
  }

  const itemTitle =
    (purchase.items as { title: string }[] | null)?.[0]?.title ?? "un artículo";

  return {
    data: {
      purchase: purchase as unknown as PurchaseWithRelations,
      itemTitle,
    },
    error: null,
  };
}

// ==================== Check if User Already Reviewed ====================
export async function hasUserReviewed(
  supabase: SupabaseClient,
  purchaseId: string,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("purchase_id", purchaseId)
    .eq("reviewer_id", userId)
    .single();

  return !!data;
}

// ==================== Get Reviews by Profile ====================
export async function getReviewsByProfile(
  supabase: SupabaseClient,
  profileId: string,
) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)")
    .eq("reviewed_id", profileId)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}
