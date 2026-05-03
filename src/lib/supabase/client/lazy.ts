/**
 *  Cliente Supabase lazy-loaded para optimización
 * Importa @supabase/ssr solo cuando se necesita (reduce bundle inicial)
 */

"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export async function getLazyClient() {
  if (!client) {
    const { createBrowserClient } = await import("@supabase/ssr");
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
