"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { redirect } from "next/navigation";
import { profileQueryService } from "@/features/profile/services/profile-query-service";
import { profileStatsService } from "@/features/profile/services/profile-stats-service";

export async function getMyProfile() {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");

  try {
    const results = await Promise.allSettled([
      profileQueryService.getProfileById(supabase, user.id),
      profileStatsService.getUserItems(supabase, user.id),
      profileStatsService.getSalesCount(supabase, user.id),
      profileStatsService.getPurchasesCount(supabase, user.id),
    ]);

    const profile = results[0].status === "fulfilled" ? results[0].value : null;
    const items = results[1].status === "fulfilled" ? results[1].value : [];
    const salesCount = results[2].status === "fulfilled" ? results[2].value : 0;
    const purchasesCount =
      results[3].status === "fulfilled" ? results[3].value : 0;

    if (!profile) {
      console.error("Profile not found for authenticated user");
      redirect("/login");
    }

    return {
      profile,
      items,
      salesCount,
      purchasesCount,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    console.error("Error fetching profile data:", error);
    redirect("/login");
  }
}
