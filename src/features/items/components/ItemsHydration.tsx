// features/items/components/ItemsHydration.tsx
"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

export function ItemsHydration({
  state,
  children,
}: {
  state: any; // dehydrated state from server
  children: ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
