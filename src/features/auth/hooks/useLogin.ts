// features/auth/hooks/useLogin.ts

"use client";

import { useState, useTransition } from "react";
import { loginAction } from "../actions";
import type { LoginInput } from "../schemas";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const login = async (data: LoginInput) => {
    setError(null);

    startTransition(async () => {
      const result = await loginAction(data);

      if (!result.success) {
        setError(result.error);
      }
      // Si success === true, el redirect ya ocurrió
    });
  };

  const clearError = () => setError(null);

  return {
    login,
    isPending,
    error,
    clearError,
  };
}
