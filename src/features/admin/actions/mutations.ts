"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminAccess } from "./queries";

export async function dismissReportAction(reportId: string) {
  const { supabase, user } = await verifyAdminAccess();

  const { error } = await supabase
    .from("reports")
    .update({
      status: "dismissed",
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  if (error) return { error: error.message };

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function markReportAsReviewedAction(reportId: string) {
  const { supabase, user } = await verifyAdminAccess();

  const { error } = await supabase
    .from("reports")
    .update({
      status: "reviewed",
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  if (error) return { error: error.message };

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function deleteReportedItemAction(
  reportId: string,
  itemId: string,
) {
  const { supabase, user } = await verifyAdminAccess();

  const { data: item } = await supabase
    .from("items")
    .select("images")
    .eq("id", itemId)
    .single();

  if (item?.images?.length) {
    const paths = item.images.map(
      (url: string) => url.split("/item-images/")[1],
    );
    await supabase.storage.from("item-images").remove(paths);
  }

  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) return { error: error.message };

  await supabase
    .from("reports")
    .update({
      status: "reviewed",
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function deleteItemAsAdminAction(itemId: string) {
  const { supabase } = await verifyAdminAccess();

  const { data: item } = await supabase
    .from("items")
    .select("images")
    .eq("id", itemId)
    .single();

  if (item?.images?.length) {
    const paths = item.images.map(
      (url: string) => url.split("/item-images/")[1],
    );
    await supabase.storage.from("item-images").remove(paths);
  }

  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/reports");
  revalidatePath("/admin", "layout");

  redirect("/admin/reports");
}
