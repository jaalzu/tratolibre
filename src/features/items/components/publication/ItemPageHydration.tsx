"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

export function ItemPageHydration({
  state,
  children,
}: {
  state: any;
  children: ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
