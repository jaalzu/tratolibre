// features/auth/hooks/useAsyncAction.ts
"use client";

import { useState, useTransition } from "react";

type AsyncState<T = void> =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export function useAsyncAction<TInput, TOutput = void>() {
  const [state, setState] = useState<AsyncState<TOutput>>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  const execute = async (
    input: TInput,
    action: (input: TInput) => Promise<ActionResult<TOutput>>,
  ) => {
    setState({ status: "pending" });

    startTransition(async () => {
      const result = await action(input);

      if (!result.success) {
        setState({ status: "error", error: result.error });
      } else {
        setState({
          status: "success",
          data: result.data as TOutput,
        });
      }
    });
  };

  const reset = () => setState({ status: "idle" });

  return {
    state,
    isPending,
    execute,
    reset,
    // Helpers para acceso rápido
    error: state.status === "error" ? state.error : null,
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  };
}
