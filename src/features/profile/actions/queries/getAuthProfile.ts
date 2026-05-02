"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { profileQueryService } from "@/features/profile/services/profile-query-service";

export async function getAuthProfile() {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return null;

    return await profileQueryService.getAuthProfile(supabase, user.id);
  } catch (error) {
    return null;
  }
}
