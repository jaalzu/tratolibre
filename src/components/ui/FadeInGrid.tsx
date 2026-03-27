"use client";

import { Children } from "react";

interface FadeInGridProps {
  children: React.ReactNode;
  startIndex?: number;
  columns?: { base?: number; md?: number; lg?: number; xl?: number };
}

export function FadeInGrid({
  children,
  startIndex = 0,
  columns = { base: 2, md: 3, lg: 5, xl: 6 }, // Default equilibrado
}: FadeInGridProps) {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-grid { 
          display: grid; 
          gap: 16px; 
          width: 100%; 
          grid-template-columns: repeat(${columns.base}, 1fr);
        }
        @media (min-width: 768px) { 
          .fade-grid { grid-template-columns: repeat(${columns.md}, 1fr); } 
        }
        @media (min-width: 992px) { 
          .fade-grid { grid-template-columns: repeat(${columns.lg}, 1fr); } 
        }
        @media (min-width: 1200px) { 
          .fade-grid { grid-template-columns: repeat(${columns.xl}, 1fr); } 
        }
        .fade-grid-item { 
          opacity: 0; 
          animation: fadeInUp 0.35s ease-out forwards; 
        }
      `}</style>
      <div className="fade-grid">
        {Children.toArray(children).map((child, idx) => (
          <div
            key={idx}
            className="fade-grid-item"
            style={{
              animationDelay: `${Math.min((startIndex + idx) * 60, 500)}ms`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
