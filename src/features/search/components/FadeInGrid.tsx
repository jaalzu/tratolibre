"use client";

import { Children } from "react";

export function FadeInGrid({
  children,
  startIndex = 0,
}: {
  children: React.ReactNode;
  startIndex?: number;
}) {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-grid { display: flex; flex-wrap: wrap; gap: 12px; width: 100%; }
        .fade-grid-item { width: calc(50% - 8px); opacity: 0; animation: fadeInUp 0.35s ease-out forwards; }
        @media (min-width: 768px) { .fade-grid-item { width: calc(33.33% - 11px); } }
      `}</style>
      <div className="fade-grid">
        {Children.toArray(children).map((child, idx) => (
          <div
            key={idx}
            className="fade-grid-item"
            style={{ animationDelay: `${Math.min(idx * 80, 400)}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
