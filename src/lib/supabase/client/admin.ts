/**
 *  Cliente Supabase con privilegios de administrador
 * Bypass RLS - usar SOLO en server-side con validaciones estrictas
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseConfig, authConfig } from "../core/config";

export function createAdminClient() {
  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: authConfig,
  });
}
