import { createClient } from "@/lib/supabase/client/server";

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Email o contraseña incorrectos");
    }

    return data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name: `${data.firstName} ${data.lastName}`,
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return authData;
  },

  /**
   * Cierra sesión
   */
  async logout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("Error al cerrar sesión");
    }
  },
};
