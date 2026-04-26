"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  createItem,
  updateItem,
  deleteItem,
} from "../../services/items-service";
import {
  parseItemFormData,
  validateItemData,
} from "../../services/item-validation.service";
import { itemErrorToMessage } from "../../services/item-error.mapper";
import { ItemError } from "../../types";

// ============================================
// TYPES - Discriminated Union para Actions
// ============================================

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string | object };

// ============================================
// CREATE ITEM ACTION
// ============================================

export async function createItemAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ itemId: string }>> {
  try {
    // 1. Autenticación
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Rate limiting
    const allowed = await checkRateLimit(
      supabase,
      user.id,
      "create_item",
      8,
      60,
    );
    if (!allowed) {
      return {
        success: false,
        error:
          "Alcanzaste el límite de 8 publicaciones por hora. Intentá más tarde.",
      };
    }

    // 3. Validación de datos
    const parsed = validateItemData(parseItemFormData(formData));
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.flatten(),
      };
    }

    // 4. Crear item usando el service con Result pattern
    const result = await createItem(supabase, {
      ...parsed.data,
      owner_id: user.id,
    });

    // 5. Manejar resultado con type narrowing
    if (!result.success) {
      return {
        success: false,
        error: itemErrorToMessage(result.error),
      };
    }

    // 6. Revalidar y redirigir
    revalidatePath("/");
    redirect(`/item/${result.data.id}`);
  } catch (error) {
    console.error("Error crítico en createItemAction:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado al crear el item",
    };
  }
}

// ============================================
// UPDATE ITEM ACTION
// ============================================

export async function updateItemAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    // 1. Autenticación
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Extraer ID y validar datos
    const id = formData.get("id") as string;
    if (!id) {
      return {
        success: false,
        error: "ID del item requerido",
      };
    }

    const parsed = validateItemData(parseItemFormData(formData));
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.flatten(),
      };
    }

    // 3. Actualizar usando el service
    const result = await updateItem(supabase, id, user.id, parsed.data);

    // 4. Manejar resultado
    if (!result.success) {
      return {
        success: false,
        error: itemErrorToMessage(result.error),
      };
    }

    // 5. Revalidar y redirigir
    revalidatePath(`/item/${id}`);
    redirect(`/item/${id}`);
  } catch (error) {
    console.error("Error crítico en updateItemAction:", error);
    return {
      success: false,
      error: "No se pudo actualizar el item",
    };
  }
}

// ============================================
// DELETE ITEM ACTION
// ============================================

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    // 1. Autenticación
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Eliminar usando el service
    const result = await deleteItem(supabase, id, user.id);

    // 3. Manejar resultado
    if (!result.success) {
      return {
        success: false,
        error: itemErrorToMessage(result.error),
      };
    }

    // 4. Revalidar y redirigir
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error crítico en deleteItemAction:", error);
    return {
      success: false,
      error: "No se pudo eliminar el item",
    };
  }
}
