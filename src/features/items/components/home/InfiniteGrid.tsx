"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Spinner, Flex, Text } from "@chakra-ui/react";
import { useInfiniteItems } from "@/features/items/hooks/useInfiniteItems";
import { ItemCard } from "./ItemCard";
import { FadeInGrid } from "@/components/ui/FadeInGrid";

interface InfiniteGridProps {
  userId: string | null;
  favoriteIds: string[];
}

export function InfiniteGrid({ userId, favoriteIds }: InfiniteGridProps) {
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          trigger.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    if (containerRef.current) trigger.observe(containerRef.current);
    return () => trigger.disconnect();
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteItems({
      enabled: isNear,
    });

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

  const allItems = data?.pages.flat().filter(Boolean) || [];

  return (
    <Box
      ref={containerRef}
      bg="white"
      borderRadius="2xl"
      p={4}
      shadow="sm"
      border="1px solid"
      borderColor="neutral.100"
      minH="200px"
      width="100%"
    >
      <Text fontWeight="bold" mt={2} fontSize="md" color="neutral.900" mb={3}>
        Explorar
      </Text>

      <FadeInGrid>
        {allItems.map((item, index) => (
          <ItemCard
            key={item.id}
            obj={item}
            userId={userId}
            initialFavorited={favoriteIds.includes(item.id)}
            priority={index < 4}
          />
        ))}
      </FadeInGrid>

      <Box ref={observerRef} h="20px" mt={4} />

      {(isFetchingNextPage || (isNear && !data)) && (
        <Flex justify="center" py={8} width="100%">
          <Spinner borderWidth="3px" color="brand.500" size="lg" />
        </Flex>
      )}
    </Box>
  );
}
