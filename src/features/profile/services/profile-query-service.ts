import { SupabaseClient } from "@supabase/supabase-js";

export const profileQueryService = {
  async getAuthProfile(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getProfileById(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getProvince(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("province")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.province ?? null;
  },
};
