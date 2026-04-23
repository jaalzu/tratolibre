"use client";

import { forgotPasswordAction, resetPasswordAction } from "../actions";
import type { ForgotPasswordInput, ResetPasswordInput } from "../schemas";
import { useAsyncAction } from "./useAsyncAction";

export function useForgotPassword() {
  const { state, isPending, execute, reset, error, isSuccess } =
    useAsyncAction<ForgotPasswordInput>();

  const sendResetEmail = (data: ForgotPasswordInput) => {
    return execute(data, forgotPasswordAction);
  };

  return {
    sendResetEmail,
    isPending,
    state,
    error,
    success: isSuccess,
    reset,
  };
}

export function useResetPassword() {
  const { state, isPending, execute, reset, error, isSuccess } =
    useAsyncAction<ResetPasswordInput>();

  const resetPassword = (data: ResetPasswordInput) => {
    return execute(data, resetPasswordAction);
  };

  return {
    resetPassword,
    isPending,
    state,
    error,
    success: isSuccess,
    reset,
  };
}
