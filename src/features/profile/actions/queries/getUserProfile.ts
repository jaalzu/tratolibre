"use server";

import { createClient } from "@/lib/supabase/server";
import { profileQueryService } from "@/features/profile/services/profile-query-service";
import { profileStatsService } from "@/features/profile/services/profile-stats-service";

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient();

    const profile = await profileQueryService.getProfileById(supabase, userId);
    if (!profile) return null;

    /**
     *  Usamos Promise.allSettled para los datos secundarios (estadísticas).
     * Esto evita que si falla una tabla (ej. 'reviews'), el perfil se rompa.
     */
    const results = await Promise.allSettled([
      profileStatsService.getUserItems(supabase, userId),
      profileStatsService.getUserReviews(supabase, userId),
      profileStatsService.getSalesCount(supabase, userId),
      profileStatsService.getPurchasesCount(supabase, userId),
    ]);

    return {
      profile,
      items: results[0].status === "fulfilled" ? results[0].value : [],
      reviews: results[1].status === "fulfilled" ? results[1].value : [],
      salesCount: results[2].status === "fulfilled" ? results[2].value : 0,
      purchasesCount: results[3].status === "fulfilled" ? results[3].value : 0,
    };
  } catch (error) {
    console.error(`Error fetching user profile (${userId}):`, error);
    return null;
  }
}
