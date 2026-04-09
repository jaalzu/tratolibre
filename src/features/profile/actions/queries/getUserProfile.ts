"use server";

import { createClient } from "@/lib/supabase/server";
import { profileQueryService } from "@/features/profile/services/profile-query-service";
import { profileStatsService } from "@/features/profile/services/profile-stats-service";

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient();

    const profile = await profileQueryService.getProfileById(supabase, userId);
    if (!profile) return null;

    const [items, reviews, salesCount, purchasesCount] = await Promise.all([
      profileStatsService.getUserItems(supabase, userId),
      profileStatsService.getUserReviews(supabase, userId),
      profileStatsService.getSalesCount(supabase, userId),
      profileStatsService.getPurchasesCount(supabase, userId),
    ]);

    return { profile, items, reviews, salesCount, purchasesCount };
  } catch (error) {
    return null;
  }
}
