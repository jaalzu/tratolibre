"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export function LazySection({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }, // Arranca a cargar 400px antes de que llegue el usuario
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={containerRef} minH="300px">
      {isNear ? children : fallback}
    </Box>
  );
}
