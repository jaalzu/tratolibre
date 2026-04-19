"use client";

import { useState, useTransition } from "react";
import { registerAction } from "../actions";
import type { RegisterInput } from "../schemas";

export function useRegister() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const register = async (data: RegisterInput) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await registerAction(data);

      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    register,
    isPending,
    error,
    success,
    reset,
  };
}
