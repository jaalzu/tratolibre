"use client";

import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

interface FadeInGridProps {
  children: React.ReactNode;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function FadeInGrid({
  children,
  columns = { base: 2, sm: 2, md: 2, lg: 3, xl: 4 },
}: FadeInGridProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-grid-item { 
          opacity: 0; 
          animation: fadeInUp 0.3s ease-out forwards;
          min-width: 0; 
          /* Importante: evitar que el contenido rompa el flex/grid */
          overflow: hidden; 
        }
      `}</style>

      <SimpleGrid columns={columns} gap={{ base: 1.5, md: 2 }} width="100%">
        {items.map((child, idx) => (
          <div
            key={idx}
            className="fade-grid-item"
            style={{
              animationDelay: `${Math.min(idx * 30, 500)}ms`,
            }}
          >
            {child}
          </div>
        ))}
      </SimpleGrid>
    </>
  );
}
