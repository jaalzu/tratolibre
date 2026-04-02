"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import { ItemSchema } from "../../schemas";

type ActionState = { error?: string | object } | null;

function parseItemFormData(formData: FormData) {
  const rawPrice = formData.get("sale_price") as string;
  const cleanPrice = rawPrice ? rawPrice.replace(/\D/g, "") : "";

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    sale_price: cleanPrice,
    province: formData.get("province"),
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    type: formData.get("type"),
    images: formData.getAll("images") as string[],
  };
}

export async function createItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const allowed = await checkRateLimit(supabase, user.id, "create_item", 8, 60);
  if (!allowed)
    return {
      error:
        "Alcanzaste el límite de 8 publicaciones por hora. Intentá más tarde.",
    };

  const parsed = ItemSchema.safeParse(parseItemFormData(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { data: item, error } = await supabase
    .from("items")
    .insert({ ...parsed.data, owner_id: user.id })
    .select()
    .single();

  if (error) {
    return { error: mapSupabaseError(error) };
  }

  revalidatePath("/");
  redirect(`/item/${item.id}`);
}

export async function updateItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const id = formData.get("id") as string;
  const parsed = ItemSchema.safeParse(parseItemFormData(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  const { error } = await supabase
    .from("items")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { error: mapSupabaseError(error) };
  }

  revalidatePath(`/item/${id}`);
  redirect(`/item/${id}`);
}

export async function deleteItemAction(id: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { error: mapSupabaseError(error) };
  }

  revalidatePath("/");
  redirect("/");
}
