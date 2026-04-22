import { SupabaseClient } from "@supabase/supabase-js";
import { ProfileUpdateData } from "@/features/profile/types";

export const profileMutationService = {
  async updateProfile(
    supabase: SupabaseClient,
    userId: string,
    data: ProfileUpdateData,
  ) {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  },
};
