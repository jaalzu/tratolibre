"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { redirect } from "next/navigation";
import { profileQueryService } from "@/features/profile/services/profile-query-service";
import { profileStatsService } from "@/features/profile/services/profile-stats-service";

export async function getMyProfile() {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) redirect("/login");

    const [profile, items, salesCount, purchasesCount] = await Promise.all([
      profileQueryService.getProfileById(supabase, user.id),
      profileStatsService.getUserItems(supabase, user.id),
      profileStatsService.getSalesCount(supabase, user.id),
      profileStatsService.getPurchasesCount(supabase, user.id),
    ]);

    return { profile, items, salesCount, purchasesCount };
  } catch (error) {
    redirect("/login");
  }
}
