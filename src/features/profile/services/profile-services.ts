import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/getAuthUser";

export const profileService = {
  async getAuthProfile() {
    const { supabase, user } = await getAuthUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getMyProfile() {
    const { supabase, user } = await getAuthUser();
    if (!user) return null;

    const [
      { data: profile, error: profileError },
      { data: items },
      { count: salesCount },
      { count: purchasesCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("items")
        .select(
          "id, title, images, sale_price, sold, available, created_at, city",
        )
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id)
        .eq("sold", true),
      supabase
        .from("purchases")
        .select("*", { count: "exact", head: true })
        .eq("buyer_id", user.id),
    ]);

    if (profileError) throw profileError;

    return {
      profile,
      items: items ?? [],
      salesCount: salesCount ?? 0,
      purchasesCount: purchasesCount ?? 0,
    };
  },

  async getUserProfile(userId: string) {
    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) return null;

    const [
      { data: items },
      { data: reviews },
      { count: salesCount },
      { count: purchasesCount },
    ] = await Promise.all([
      supabase
        .from("items")
        .select(
          "id, title, images, sale_price, sold, available, created_at, city",
        )
        .eq("owner_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select(
          "*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)",
        )
        .eq("reviewed_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId)
        .eq("sold", true),
      supabase
        .from("purchases")
        .select("*", { count: "exact", head: true })
        .eq("buyer_id", userId),
    ]);

    return {
      profile,
      items: items ?? [],
      reviews: reviews ?? [],
      salesCount: salesCount ?? 0,
      purchasesCount: purchasesCount ?? 0,
    };
  },

  async getUserProvince(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("province")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.province ?? null;
  },

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      location?: string;
      province?: string;
      avatar_url?: string;
    },
  ) {
    const { supabase } = await getAuthUser();

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
