import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "jpg",
  "image/heif": "jpg",
};

const BUCKET = "item-images";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  console.log("RECIBIDO EN API:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = ALLOWED_TYPES[file.type];
  if (!ext)
    return NextResponse.json(
      { error: "Tipo de archivo no permitido" },
      { status: 400 },
    );

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "El archivo es muy grande" },
      { status: 400 },
    );
  }

  const allowed = await checkRateLimit(
    supabase,
    user.id,
    "upload_image",
    20,
    60,
  );
  if (!allowed)
    return NextResponse.json(
      { error: "Límite de subidas alcanzado" },
      { status: 429 },
    );

  const filename = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
