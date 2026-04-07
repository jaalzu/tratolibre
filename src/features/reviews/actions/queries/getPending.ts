"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getPendingReviewsService } from "../../services/pending-service";
import type { PendingReview } from "../../types";

export async function getPendingReviewsAction(): Promise<PendingReview[]> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) return [];

    return await getPendingReviewsService(supabase, user.id);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);

    return [];
  }
}
