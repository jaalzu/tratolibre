"use client";

import dynamic from "next/dynamic";

export const DynamicFilterPanel = dynamic(
  () => import("./FilterPanel").then((mod) => mod.FilterPanel),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
          padding: "16px",
          height: "560px",
        }}
      />
    ),
  },
);
