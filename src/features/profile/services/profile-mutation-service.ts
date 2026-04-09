import { SupabaseClient } from "@supabase/supabase-js";

export const profileMutationService = {
  async updateProfile(
    supabase: SupabaseClient,
    userId: string,
    data: {
      name?: string;
      location?: string;
      province?: string;
      avatar_url?: string;
    },
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
