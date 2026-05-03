"use server";

import { createClient } from "@/lib/supabase/client/server";
import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { ItemsService } from "@/lib/supabase/services";
import { checkRateLimit, RATE_LIMITS } from "@/lib/supabase/utils/rate-limiter";
import { mapSupabaseError } from "@/lib/supabase/core/errors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  CreateItemInput,
  UpdateItemInput,
} from "@/lib/supabase/mappers/item";

// ============================================
// TYPES
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
  let itemId: string | undefined;

  try {
    // 1. Autenticación
    const { user } = await getAuthUser();
    if (!user) {
      return { success: false, error: "No autorizado" };
    }

    // 2. Inicializar cliente y service
    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    // 3. Rate limiting
    await checkRateLimit(
      supabase,
      user.id,
      "create_item",
      RATE_LIMITS.CREATE_ITEM,
    );

    // 4. Helper para parsear JSON seguro
    const parseImages = (raw: FormDataEntryValue | null): string[] => {
      if (!raw || raw === "null") return [];
      try {
        return JSON.parse(raw as string);
      } catch {
        return [];
      }
    };

    // 5. Parsear datos del form
    const itemData: CreateItemInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      salePrice: formData.get("salePrice")
        ? Number(formData.get("salePrice"))
        : undefined,
      province: formData.get("province") as string | undefined,
      city: formData.get("city") as string | undefined,
      condition: formData.get("condition") as string | undefined,
      type: formData.get("type") as string | undefined,
      images: parseImages(formData.get("images")),
      rules: formData.get("rules") as string | undefined,
      location: formData.get("location") as string | undefined,
    };

    // 6. Crear item
    const item = await itemsService.create(itemData, user.id);
    itemId = item.id;

    // 7. Revalidar
    revalidatePath("/");
    revalidatePath(`/item/${itemId}`);
  } catch (error: any) {
    console.error("Error en createItemAction:", error);

    if (error.code === "RATE_LIMIT") {
      return {
        success: false,
        error:
          "Alcanzaste el límite de publicaciones por hora. Intentá más tarde.",
      };
    }

    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }

  redirect(`/item/${itemId}`);
}

// ============================================
// UPDATE ITEM ACTION
// ============================================

export async function updateItemAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const itemId = formData.get("id") as string;

  try {
    // 1. Validar ID
    if (!itemId) {
      return {
        success: false,
        error: "ID del item requerido",
      };
    }

    // 2. Autenticación
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 3. Inicializar cliente y service
    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    // 4. Parsear datos del form
    const itemData: UpdateItemInput = {
      title: formData.get("title") as string | undefined,
      description: formData.get("description") as string | undefined,
      category: formData.get("category") as string | undefined,
      salePrice: formData.get("salePrice")
        ? Number(formData.get("salePrice"))
        : undefined,
      province: formData.get("province") as string | undefined,
      city: formData.get("city") as string | undefined,
      condition: formData.get("condition") as string | undefined,
      type: formData.get("type") as string | undefined,
      images: formData.get("images")
        ? JSON.parse(formData.get("images") as string)
        : undefined,
      rules: formData.get("rules") as string | undefined,
      location: formData.get("location") as string | undefined,
      available: formData.get("available") === "true",
    };

    // 5. Actualizar item
    await itemsService.update(itemId, itemData, user.id);

    // 6. Revalidar
    revalidatePath(`/item/${itemId}`);
    revalidatePath("/");
  } catch (error: any) {
    console.error("Error en updateItemAction:", error);
    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }

  // ✅ redirect() FUERA del try-catch
  redirect(`/item/${itemId}`);
}

// ============================================
// DELETE ITEM ACTION
// ============================================

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    // 1. Autenticación
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Inicializar cliente y service
    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    // 3. Eliminar item
    await itemsService.delete(id, user.id);

    // 4. Revalidar
    revalidatePath("/");
  } catch (error: any) {
    console.error("Error en deleteItemAction:", error);
    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }

  redirect("/");
}

// ============================================
// TOGGLE AVAILABILITY ACTION
// ============================================

export async function toggleItemAvailabilityAction(
  id: string,
): Promise<ActionResult<{ available: boolean }>> {
  try {
    // 1. Autenticación
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Inicializar cliente y service
    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    const item = await itemsService.toggleAvailability(id, user.id);

    // 4. Revalidar
    revalidatePath(`/item/${id}`);
    revalidatePath("/");

    return {
      success: true,
      data: { available: item.available },
    };
  } catch (error: any) {
    console.error("Error en toggleItemAvailabilityAction:", error);
    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }
}

// ============================================
// MARK AS SOLD ACTION
// ============================================

export async function markItemAsSoldAction(id: string): Promise<ActionResult> {
  try {
    // 1. Autenticación
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    // 2. Inicializar cliente y service
    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    // 3. Marcar como vendido
    await itemsService.markAsSold(id, user.id);

    // 4. Revalidar
    revalidatePath(`/item/${id}`);
    revalidatePath("/");

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error("Error en markItemAsSoldAction:", error);
    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }
}
