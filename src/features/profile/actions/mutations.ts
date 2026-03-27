"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EditProfileSchema } from "@/features/profile/schemas";
import { checkRateLimit } from "@/lib/rateLimit";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function uploadAvatar(
  supabase: any,
  userId: string,
  avatar: File,
): Promise<{ url: string } | { error: string }> {
  const ext = ALLOWED_IMAGE_TYPES[avatar.type];
  if (!ext) return { error: "Tipo de imagen no permitido" };

  const filename = `${userId}/avatar.${ext}`;
  const { data, error } = await supabase.storage
    .from("profile-avatars")
    .upload(filename, avatar, { contentType: avatar.type, upsert: true });

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-avatars").getPublicUrl(data.path);
  return { url: publicUrl };
}

export async function updateProfileAction(formData: FormData) {
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
    const result = await uploadAvatar(supabase, user.id, avatar);
    if ("error" in result) return { error: result.error };
    avatarUrl = result.url;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      location: parsed.data.location,
      province: parsed.data.province,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
}
