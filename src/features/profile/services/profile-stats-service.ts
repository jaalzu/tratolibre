import { SupabaseClient } from "@supabase/supabase-js";

export const profileStatsService = {
  async getUserItems(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("items")
      .select(
        "id, title, images, sale_price, sold, available, created_at, city",
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getSalesCount(supabase: SupabaseClient, userId: string) {
    const { count, error } = await supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId)
      .eq("sold", true);

    if (error) throw error;
    return count ?? 0;
  },

  async getPurchasesCount(supabase: SupabaseClient, userId: string) {
    const { count, error } = await supabase
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .eq("buyer_id", userId);

    if (error) throw error;
    return count ?? 0;
  },

  async getUserReviews(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)")
      .eq("reviewed_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },
};
