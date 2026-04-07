"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/features/notifications/actions";
import { ReviewSchema } from "../../schemas";
import {
  createReview,
  validateReviewPermissions,
} from "../../services/review-service";
import type { ReviewInput } from "../../schemas";

export async function submitReviewAction(input: ReviewInput) {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const parsed = ReviewSchema.safeParse(input);
    if (!parsed.success) return { error: "Datos inválidos" };

    const { data: validation, error: vError } = await validateReviewPermissions(
      supabase,
      parsed.data.purchase_id,
      user.id,
      parsed.data.reviewed_id,
    );

    if (vError || !validation) return { error: vError };

    const { error: insertError } = await createReview(supabase, {
      purchase_id: parsed.data.purchase_id,
      reviewer_id: user.id,
      reviewed_id: parsed.data.reviewed_id,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
      role: parsed.data.role,
    });

    if (insertError) {
      const isDuplicate =
        typeof insertError === "object" &&
        (insertError as any).code === "23505";
      return {
        error: isDuplicate
          ? "Ya dejaste una reseña para esta compra"
          : insertError,
      };
    }

    try {
      await createNotification({
        userId: parsed.data.reviewed_id,
        type: "review_received",
        data: {
          reviewer_id: user.id,
          rating: parsed.data.rating,
          purchase_id: parsed.data.purchase_id,
          item_title: validation.itemTitle,
        },
      });
      revalidatePath(`/profile/${parsed.data.reviewed_id}`);
    } catch (notifyError) {
      console.error("Error no crítico (notificación/revalidate):", notifyError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error crítico en submitReviewAction:", error);
    return { error: "Ocurrió un error inesperado al enviar la reseña" };
  }
}
