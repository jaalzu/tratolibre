"use server";

import { getAdminClient } from "./utils";

export async function getAdminMetrics() {
  const supabase = await getAdminClient();

  const [
    { count: totalUsers },
    { count: newUsers },
    { count: totalItems },
    { count: newItems },
    { count: pendingReports },
    { count: totalSales },
    { data: salesValue },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("available", true)
      .eq("sold", false),
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("items")
      .select("*", { count: "exact", head: true })
      .eq("sold", true),
    supabase.from("items").select("sale_price").eq("sold", true),
  ]);

  const totalSalesValue =
    salesValue?.reduce((acc, item) => acc + (item.sale_price ?? 0), 0) ?? 0;

  return {
    totalUsers: totalUsers ?? 0,
    newUsers: newUsers ?? 0,
    totalItems: totalItems ?? 0,
    newItems: newItems ?? 0,
    pendingReports: pendingReports ?? 0,
    totalSales: totalSales ?? 0,
    totalSalesValue,
  };
}

export async function getAdminReports(type?: string, status?: string) {
  const supabase = await getAdminClient();

  let query = supabase
    .from("reports")
    .select(
      `
      *,
      reporter:profiles!reports_reporter_id_fkey(id, name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false });

  if (type && type !== "all") query = query.eq("type", type);
  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return [];
  return data;
}

export async function getAdminConversation(id: string) {
  const supabase = await getAdminClient();

  const [{ data: conversation }, { data: messages }] = await Promise.all([
    supabase.from("conversation_summaries").select("*").eq("id", id).single(),
    supabase
      .from("messages")
      .select("*, profiles(name, avatar_url)")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(100),
  ]);

  return {
    conversation: conversation ?? null,
    messages: messages ?? [],
  };
}
