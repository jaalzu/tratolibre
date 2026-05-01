/**
 * Sistema de rate limiting usando tabla rate_limits
 * Previene spam y abuso de endpoints
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { RateLimitError } from "../core/errors";

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
    throw new RateLimitError(action);
  }

  await supabase.from("rate_limits").insert({ user_id: userId, action });
}

// Rate limits predefinidos
export const RATE_LIMITS = {
  CREATE_ITEM: { max: 10, windowMin: 60 }, // 10 publicaciones por hora
  UPDATE_PROFILE: { max: 5, windowMin: 60 }, // 5 actualizaciones por hora
  SEND_MESSAGE: { max: 250, windowMin: 60 }, // 50 mensajes por hora
  CREATE_REPORT: { max: 3, windowMin: 60 }, // 3 reportes por hora
} as const;
