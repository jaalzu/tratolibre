"use client";

import dynamic from "next/dynamic";

export const DynamicFilterPanel = dynamic(
  () => import("./FilterPanel").then((mod) => mod.FilterPanel),
  {
    ssr: false,
    loading: () => <div style={{ width: "220px" }} />,
  },
);
