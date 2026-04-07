import type { SupabaseClient } from "@supabase/supabase-js";
import type { PurchaseWithRelations, PendingReview } from "../types";

// ==================== Get Pending Reviews ====================
export async function getPendingReviewsService(
  supabase: SupabaseClient,
  userId: string,
): Promise<PendingReview[]> {
  // 1. Buscamos compras completadas donde el usuario sea comprador o vendedor
  const { data: purchases, error: pError } = await supabase
    .from("purchases")
    .select(
      `
      *,
      items(title, images),
      buyer:profiles!purchases_buyer_id_fkey(id, name),
      owner:profiles!purchases_owner_id_fkey(id, name)
    `,
    )
    .or(`buyer_id.eq.${userId},owner_id.eq.${userId}`)
    .eq("status", "completed");

  if (pError || !purchases?.length) return [];

  // 2. Buscamos qué reseñas ya escribió el usuario
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("purchase_id")
    .eq("reviewer_id", userId);

  const reviewedPurchaseIds = new Set(
    myReviews?.map((r) => r.purchase_id) ?? [],
  );

  // 3. Filtramos y mapeamos a la interfaz PendingReview
  return (purchases as unknown as PurchaseWithRelations[])
    .filter((p) => !reviewedPurchaseIds.has(p.id))
    .map((p) => {
      const isBuyer = p.buyer_id === userId;

      // Determinamos quién es la contraparte (el "reviewed")
      const reviewedId = isBuyer ? p.owner_id : p.buyer_id;
      const reviewedRaw = isBuyer ? p.owner : p.buyer;

      // Limpiamos el título del item (manejando si viene como array o objeto)
      const itemTitle = Array.isArray(p.items)
        ? p.items[0]?.title
        : ((p.items as any)?.title ?? "este artículo");

      return {
        ...p,
        // Usamos "as const" para que TS sepa que es el tipo literal "buyer" | "seller"
        myRole: isBuyer ? ("buyer" as const) : ("seller" as const),
        reviewedId,
        reviewedName: reviewedRaw?.name ?? "el usuario",
        itemTitle,
      };
    });
}
