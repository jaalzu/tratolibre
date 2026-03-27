"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthProfile() {
  const { supabase, user } = await getAuthUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getMyProfile() {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
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

  return {
    profile,
    items: items ?? [],
    salesCount: salesCount ?? 0,
    purchasesCount: purchasesCount ?? 0,
  };
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) return null;

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
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)")
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
}

export async function getUserProvince(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("province")
    .eq("id", userId)
    .single();
  return data?.province ?? null;
}
