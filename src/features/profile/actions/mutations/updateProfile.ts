"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rateLimit";
import { EditProfileSchema } from "@/features/profile/schemas";
import { avatarService } from "@/features/profile/services/avatar-service";
import { profileMutationService } from "@/features/profile/services/profile-mutation-service";

export async function updateProfileAction(formData: FormData) {
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
    if (!allowed) return { error: "Demasiados intentos, esperá unos minutos" };

    const parsed = EditProfileSchema.safeParse({
      name: formData.get("name"),
      location: formData.get("location"),
      province: formData.get("province"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

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
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Error al actualizar perfil",
    };
  }
}
