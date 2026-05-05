/**
 * Sistema de rate limiting usando tabla rate_limits
 * Previene spam y abuso de endpoints
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { RateLimitError } from "../core/errors";

export { RateLimitError };

interface RateLimitOptions {
  max: number; // Máximo de intentos
  windowMin: number; // Ventana de tiempo en minutos
}

/**
 * Verifica si el usuario puede realizar una acción
 * @throws {RateLimitError} Si se superó el límite
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  options: RateLimitOptions,
): Promise<void> {
  const { max, windowMin } = options;
  const since = new Date(Date.now() - windowMin * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", since);

  if ((count ?? 0) >= max) {
    // Ahora TS reconoce RateLimitError porque lo importamos arriba
    throw new RateLimitError(action);
  }

  await supabase.from("rate_limits").insert({ user_id: userId, action });
}

// Rate limits predefinidos
export const RATE_LIMITS = {
  CREATE_ITEM: { max: 10, windowMin: 60 },
  UPDATE_PROFILE: { max: 5, windowMin: 60 },
  SEND_MESSAGE: { max: 250, windowMin: 60 },
  CREATE_REPORT: { max: 3, windowMin: 60 },
} as const;
