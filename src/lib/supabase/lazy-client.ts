"use client";

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export async function getLazySupabaseClient() {
  if (!client) {
    // Lazy import de @supabase/ssr
    const { createBrowserClient: create } = await import("@supabase/ssr");
    client = create(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
