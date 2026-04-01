"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginSchema, RegisterSchema } from "./schemas";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function loginAction(input: { email: string; password: string }) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: "Email o contraseña incorrectos" };
  redirect("/");
}

export async function registerAction(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { name: `${parsed.data.firstName} ${parsed.data.lastName}` },
    },
  });

  if (error) return { error: error.message };

  return { success: true };
}
