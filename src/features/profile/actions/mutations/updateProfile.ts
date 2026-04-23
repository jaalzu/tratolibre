"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import { EditProfileSchema } from "@/features/profile/schemas";
import { avatarService } from "@/features/profile/services/avatar-service";
import { profileMutationService } from "@/features/profile/services/profile-mutation-service";

// Definimos el tipo de respuesta para que el Hook lo entienda perfectamente
export type UpdateProfileResponse =
  | { status: "success" }
  | { status: "error"; message: string };

export async function updateProfileAction(
  formData: FormData,
): Promise<UpdateProfileResponse> {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) redirect("/login");

    const allowed = await checkRateLimit(
      supabase,
      user.id,
      "update_profile",
      5,
      10,
    );
    if (!allowed) {
      return {
        status: "error",
        message: "Demasiados intentos, esperá unos minutos",
      };
    }

    const parsed = EditProfileSchema.safeParse({
      name: formData.get("name"),
      location: formData.get("location"),
      province: formData.get("province"),
    });

    if (!parsed.success) {
      return { status: "error", message: parsed.error.issues[0].message };
    }

    let avatarUrl: string | undefined;
    const avatar = formData.get("avatar") as File | null;

    if (avatar && avatar.size > 0) {
      avatarUrl = await avatarService.uploadAvatar(supabase, user.id, avatar);
    }

    await profileMutationService.updateProfile(supabase, user.id, {
      name: parsed.data.name,
      location: parsed.data.location,
      province: parsed.data.province,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    revalidatePath("/profile");
    return { status: "success" };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Error al actualizar perfil",
    };
  }
}
