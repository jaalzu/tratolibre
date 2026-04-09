"use server";

import { createClient } from "@/lib/supabase/server";
import { profileQueryService } from "@/features/profile/services/profile-query-service";

export async function getUserProvince(userId: string) {
  try {
    const supabase = await createClient();
    return await profileQueryService.getProvince(supabase, userId);
  } catch (error) {
    return null;
  }
}
