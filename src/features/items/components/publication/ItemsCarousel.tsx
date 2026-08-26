"use client";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@boxicons/react";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import type { ItemWithProfile } from "@/features/items/types";

interface ItemsCarouselProps {
  title: string;
  items: ItemWithProfile[];
  userId?: string | null;
}

export function ItemsCarousel({
  title,
  items,
  userId = null,
}: ItemsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [items]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <Box>
      {/* Header: título + flechas <> juntas a la derecha */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="neutral.900">
          {title}
        </Text>

        <Flex gap={2}>
          <IconButton
            aria-label="Anterior"
            onClick={() => scrollBy(-1)}
            size="md"
            borderRadius="full"
            variant="outline"
            borderColor="accent.default"
            color="accent.default"
            bg="neutral.50"
            _hover={{ opacity: 0.8 }}
            disabled={!canScrollLeft}
            opacity={canScrollLeft ? 1 : 0.3}
          >
            <ChevronLeft width="18px" height="18px" />
          </IconButton>
          <IconButton
            aria-label="Siguiente"
            onClick={() => scrollBy(1)}
            size="md"
            borderRadius="full"
            variant="outline"
            borderColor="accent.default"
            color="accent.default"
            bg="neutral.50"
            _hover={{ opacity: 0.8 }}
            disabled={!canScrollRight}
            opacity={canScrollRight ? 1 : 0.3}
          >
            <ChevronRight width="18px" height="18px" />
          </IconButton>
        </Flex>
      </Flex>

      <Flex
        ref={scrollRef}
        overflowX="auto"
        gap={4}
        pb={2}
        css={{
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {items.map((obj) => (
          <Box
            key={obj.id}
            flex="0 0 auto"
            w={{ base: "170px", md: "240px" }}
            css={{ scrollSnapAlign: "start" }}
          >
            <ItemCard obj={obj} userId={userId} variant="wide" />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
