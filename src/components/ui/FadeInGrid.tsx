"use client";

import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

interface FadeInGridProps {
  children: React.ReactNode;
}

export function FadeInGrid({ children }: FadeInGridProps) {
  // Filtramos para que solo entren elementos válidos y no espacios vacíos
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-grid-container {
          width: 100%;
          display: grid;
          /* Esto obliga a que no haya celdas fantasmas al inicio */
          grid-auto-flow: row; 
        }
        .fade-grid-item { 
          opacity: 0; 
          animation: fadeInUp 0.3s ease-out forwards;
          /* Evitamos que el div interfiera con el tamaño del item */
          min-width: 0; 
        }
      `}</style>

      <SimpleGrid
        className="fade-grid-container"
        gridTemplateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
        gap={4}
        width="100%"
      >
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
