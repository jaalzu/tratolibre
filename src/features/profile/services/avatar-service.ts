import { SupabaseClient } from "@supabase/supabase-js";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const avatarService = {
  async uploadAvatar(supabase: SupabaseClient, userId: string, avatar: File) {
    const ext = ALLOWED_IMAGE_TYPES[avatar.type];
    if (!ext) throw new Error("Tipo de imagen no permitido");

    const filename = `${userId}/avatar.${ext}`;
    const { data, error } = await supabase.storage
      .from("profile-avatars")
      .upload(filename, avatar, { contentType: avatar.type, upsert: true });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-avatars").getPublicUrl(data.path);

    return publicUrl;
  },
};
