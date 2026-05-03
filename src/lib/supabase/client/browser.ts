/**
 *  Cliente Supabase para navegador (Client Components)
 */

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "../core/config";

export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
