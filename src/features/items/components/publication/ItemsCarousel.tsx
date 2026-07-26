"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@boxicons/react";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import type { ItemWithProfile } from "@/features/items/types";

interface ItemsCarouselProps {
  items: ItemWithProfile[];
  userId?: string | null;
}

export function ItemsCarousel({ items, userId = null }: ItemsCarouselProps) {
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
    const cardWidth = el.firstElementChild?.clientWidth ?? 200;
    el.scrollBy({ left: dir * (cardWidth + 16) * 2, behavior: "smooth" });
  };

  return (
    <Box position="relative">
      {canScrollLeft && (
        <IconButton
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          position="absolute"
          left="-4px"
          top="35%"
          zIndex={2}
          size="sm"
          borderRadius="full"
          display={{ base: "none", md: "flex" }}
          boxShadow="md"
          bg="white"
        >
          <ChevronLeft width="18px" height="18px" />
        </IconButton>
      )}

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
            w={{ base: "270px", md: "330px" }}
            css={{ scrollSnapAlign: "start" }}
          >
            <ItemCard obj={obj} userId={userId} variant="wide" />
          </Box>
        ))}
      </Flex>

      {canScrollRight && (
        <IconButton
          aria-label="Siguiente"
          onClick={() => scrollBy(1)}
          position="absolute"
          right="-4px"
          top="35%"
          zIndex={2}
          size="sm"
          borderRadius="full"
          display={{ base: "none", md: "flex" }}
          boxShadow="md"
          bg="white"
        >
          <ChevronRight width="18px" height="18px" />
        </IconButton>
      )}
    </Box>
  );
}
