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
    const { user } = await getAuthUser();
    if (!user) {
      return { success: false, error: "No autorizado" };
    }

    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    await checkRateLimit(
      supabase,
      user.id,
      "create_item",
      RATE_LIMITS.CREATE_ITEM,
    );

    const parseImages = (raw: FormDataEntryValue | null): string[] => {
      if (!raw || raw === "null") return [];
      try {
        return JSON.parse(raw as string);
      } catch {
        return [];
      }
    };

    const itemData: CreateItemInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      salePrice: formData.get("sale_price")
        ? Number(formData.get("sale_price"))
        : undefined,
      province: formData.get("province") as string | undefined,
      city: formData.get("city") as string | undefined,
      condition: formData.get("condition") as string | undefined,
      type: formData.get("type") as string | undefined,
      images: parseImages(formData.get("images")),
      rules: formData.get("rules") as string | undefined,
      location: formData.get("location") as string | undefined,
    };

    const item = await itemsService.create(itemData, user.id);
    itemId = item.id;

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
): Promise<ActionResult<{ itemId: string }>> {
  const itemId = formData.get("id") as string;

  try {
    if (!itemId) {
      return {
        success: false,
        error: "ID del item requerido",
      };
    }

    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    const itemData: UpdateItemInput = {
      title: formData.get("title") as string | undefined,
      description: formData.get("description") as string | undefined,
      category: formData.get("category") as string | undefined,
      salePrice: formData.get("sale_price")
        ? Number(formData.get("sale_price"))
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
      // available: formData.get("available") === "true",
    };

    await itemsService.update(itemId, itemData, user.id);

    revalidatePath(`/item/${itemId}`);
    revalidatePath("/");

    return {
      success: true,
      data: { itemId },
    };
  } catch (error: any) {
    console.error("Error en updateItemAction:", error);
    return {
      success: false,
      error: mapSupabaseError(error),
    };
  }
}

// ============================================
// DELETE ITEM ACTION
// ============================================

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    await itemsService.delete(id, user.id);

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
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    const item = await itemsService.toggleAvailability(id, user.id);

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
    const { user } = await getAuthUser();
    if (!user) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    const supabase = await createClient();
    const itemsService = new ItemsService(supabase);

    await itemsService.markAsSold(id, user.id);

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
