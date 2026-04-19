import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Tipo que representa un usuario en tu aplicación
 * (Independiente de Supabase)
 */
export type AppUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  emailVerified: boolean;
  createdAt: Date;
};

/**
 * Mapper: Supabase User → App User
 * Transforma el objeto de Supabase al formato de tu app
 */
export const mapSupabaseUserToAppUser = (
  supabaseUser: SupabaseUser,
): AppUser => {
  const firstName = supabaseUser.user_metadata?.first_name ?? null;
  const lastName = supabaseUser.user_metadata?.last_name ?? null;

  // Compute fullName
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    firstName,
    lastName,
    fullName,
    emailVerified: !!supabaseUser.email_confirmed_at,
    createdAt: new Date(supabaseUser.created_at),
  };
};

/**
 * Mapper: Register Input → Supabase SignUp Options
 * Transforma los datos del form al formato que espera Supabase
 */
export const mapRegisterInputToSupabaseSignUp = (input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  return {
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
      },
    },
  };
};
