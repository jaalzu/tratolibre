"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { hasUserReviewed } from "../../services/review-service";

export async function hasReviewedPurchaseAction(
  purchaseId: string,
): Promise<boolean> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) return false;

    return await hasUserReviewed(supabase, purchaseId, user.id);
  } catch (error) {
    console.error(
      `Error checking review status for purchase ${purchaseId}:`,
      error,
    );

    return false;
  }
}
