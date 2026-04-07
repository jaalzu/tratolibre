"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import {
  createItem,
  updateItem,
  deleteItem,
} from "../../services/items-service";
import {
  parseItemFormData,
  validateItemData,
} from "../../services/item-validation.service";

type ActionState = { error?: string | object } | null;

export async function createItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  let redirectTo = "";

  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const allowed = await checkRateLimit(
      supabase,
      user.id,
      "create_item",
      8,
      60,
    );
    if (!allowed) {
      return {
        error:
          "Alcanzaste el límite de 8 publicaciones por hora. Intentá más tarde.",
      };
    }

    const parsed = validateItemData(parseItemFormData(formData));
    if (!parsed.success) return { error: parsed.error.flatten() };

    const { item, error } = await createItem(supabase, {
      ...parsed.data,
      owner_id: user.id,
    });

    if (error) return { error: mapSupabaseError(error) };

    revalidatePath("/");
    redirectTo = `/item/${item!.id}`;
  } catch (error) {
    console.error("Error en createItemAction:", error);
    return { error: "Ocurrió un error inesperado al crear el item" };
  }

  if (redirectTo) redirect(redirectTo);
}

export async function updateItemAction(
  _prevState: ActionState,
  formData: FormData,
) {
  let redirectTo = "";

  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const id = formData.get("id") as string;
    const parsed = validateItemData(parseItemFormData(formData));
    if (!parsed.success) return { error: parsed.error.flatten() };

    const { error } = await updateItem(supabase, id, user.id, parsed.data);
    if (error) return { error: mapSupabaseError(error) };

    revalidatePath(`/item/${id}`);
    redirectTo = `/item/${id}`;
  } catch (error) {
    console.error("Error en updateItemAction:", error);
    return { error: "No se pudo actualizar el item" };
  }

  if (redirectTo) redirect(redirectTo);
}

export async function deleteItemAction(id: string) {
  let shouldRedirect = false;

  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const { error } = await deleteItem(supabase, id, user.id);
    if (error) return { error: mapSupabaseError(error) };

    revalidatePath("/");
    shouldRedirect = true;
  } catch (error) {
    console.error("Error en deleteItemAction:", error);
    return { error: "No se pudo eliminar el item" };
  }

  if (shouldRedirect) redirect("/");
}
