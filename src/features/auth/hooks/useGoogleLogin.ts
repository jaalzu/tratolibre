"use client";

import { useState } from "react";
import { googleLoginService } from "../services/google-login-service";

export function useGoogleLogin() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsPending(true);
    setError(null);

    try {
      await googleLoginService();
      // Supabase automáticamente redirige, no necesitamos más lógica
    } catch (err) {
      setError("Error al iniciar sesión con Google");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleGoogleLogin,
    isPending,
    error,
    clearError: () => setError(null),
  };
}
