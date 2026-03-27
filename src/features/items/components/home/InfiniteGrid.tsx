"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Spinner, Flex, Text } from "@chakra-ui/react";
import { useInfiniteItems } from "@/features/items/hooks/useInfiniteItems";
import { ItemCard } from "./ItemCard";
import { FadeInGrid } from "@/features/search/components/FadeInGrid";

interface InfiniteGridProps {
  userId: string | null;
  favoriteIds: string[];
}

export function InfiniteGrid({ userId, favoriteIds }: InfiniteGridProps) {
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // 1. Observer para "despertar" la carga inicial (Baja prioridad)
  useEffect(() => {
    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          trigger.disconnect(); // Ya despertó, no lo necesitamos más
        }
      },
      { rootMargin: "300px" }, // Se activa 300px antes de llegar
    );

    if (containerRef.current) trigger.observe(containerRef.current);
    return () => trigger.disconnect();
  }, []);

  // Pasamos el enabled: isNear al hook
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteItems({
      enabled: isNear,
    });

  // 2. Tu observer original para el scroll infinito (Cargar más)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  let totalItemsCount = 0;

  return (
    <Box
      ref={containerRef}
      bg="white"
      borderRadius="2xl"
      p={2}
      shadow="sm"
      border="1px solid"
      borderColor="neutral.100"
      minH="200px" // Espacio mínimo para que el observer funcione
    >
      <Text
        fontWeight="bold"
        ml={2}
        mt={2}
        fontSize="md"
        color="neutral.900"
        mb={3}
      >
        Explorar
      </Text>

      {data?.pages.map((page, pageIndex) => {
        const pageStart = totalItemsCount;
        totalItemsCount += page.length;

        return (
          <FadeInGrid
            key={pageIndex}
            startIndex={pageStart}
            columns={{ base: 2, md: 4, lg: 6 }}
          >
            {page.map((item, index) => (
              <ItemCard
                key={item.id}
                obj={item}
                userId={userId}
                initialFavorited={favoriteIds.includes(item.id)}
                priority={false}
              />
            ))}
          </FadeInGrid>
        );
      })}

      <Box ref={observerRef} h="20px" mt={4} />

      {(isFetchingNextPage || (isNear && !data)) && (
        <Flex justify="center" py={8}>
          <Spinner borderWidth="3px" color="brand.500" size="lg" />
        </Flex>
      )}
    </Box>
  );
}
