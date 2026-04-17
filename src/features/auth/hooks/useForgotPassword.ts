"use client";

import { useState, useTransition } from "react";
import { forgotPasswordAction, resetPasswordAction } from "../actions";
import type { ForgotPasswordInput, ResetPasswordInput } from "../schemas";

export function useForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sendResetEmail = async (data: ForgotPasswordInput) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await forgotPasswordAction(data);

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
    sendResetEmail,
    isPending,
    error,
    success,
    reset,
  };
}

export function useResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const resetPassword = async (data: ResetPasswordInput) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await resetPasswordAction(data);

      // ✅ Chequear success primero
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
    resetPassword,
    isPending,
    error,
    success,
    reset,
  };
}
