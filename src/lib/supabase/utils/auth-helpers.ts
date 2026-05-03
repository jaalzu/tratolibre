/**
 *  Helpers para autenticación y autorización
 */

import { cache } from "react";
import { createClient } from "../client/server";
import type { Database } from "../core/types";

type UserRole = Database["public"]["Tables"]["profiles"]["Row"]["role"];

/**
 * Obtiene el usuario autenticado
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Obtiene el usuario con su rol (cached)
 */
export const getAuthUserWithRole = cache(async () => {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return { supabase, user: null, role: null };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    role: (data?.role ?? "user") as UserRole,
  };
});

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(requiredRole: UserRole) {
  const { role } = await getAuthUserWithRole();
  return role === requiredRole;
}

/**
 * Verifica si el usuario es admin
 */
export async function isAdmin() {
  return hasRole("admin");
}
