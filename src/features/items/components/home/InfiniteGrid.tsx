"use client";

import { useEffect, useRef } from "react";
import { Box, Spinner, Flex, Text } from "@chakra-ui/react";
import { useInfiniteItems } from "@/features/items/hooks/useInfiniteItems";
import { ItemCard } from "./ItemCard";
import { FadeInGrid } from "@/features/search/components/FadeInGrid";

interface InfiniteGridProps {
  userId: string | null;
  favoriteIds: string[];
}

export function InfiniteGrid({ userId, favoriteIds }: InfiniteGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteItems();
  const observerRef = useRef<HTMLDivElement>(null);

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

  return (
    <Box bg="neutral.50" borderRadius="2xl" p={4} shadow="base">
      <Text fontWeight="bold" fontSize="md" color="neutral.900" mb={3}>
        Explorar
      </Text>

      <Box borderTop="1px solid" borderColor="neutral.100" mb={3} mx={-4} />

      {data?.pages.map((page, pageIndex) => (
        <FadeInGrid key={pageIndex}>
          {page.map((item, index) => (
            <ItemCard
              key={item.id}
              obj={item}
              userId={userId}
              initialFavorited={favoriteIds.includes(item.id)}
              priority={pageIndex === 0 && index < 4}
            />
          ))}
        </FadeInGrid>
      ))}

      <Box ref={observerRef} h="20px" mt={4} />

      {isFetchingNextPage && (
        <Flex justify="center" py={6}>
          <Spinner size="md" color="brand.default" />
        </Flex>
      )}
    </Box>
  );
}
