"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HeroSlideContent } from "./Hero";

export function HeroCarousel({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Autoplay: Directo al grano
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % slides.length;
      scrollTo(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [index, slides.length]);

  const scrollTo = (i: number) => {
    setIndex(i);
    scrollRef.current?.scrollTo({
      left: scrollRef.current.offsetWidth * i,
      behavior: "smooth",
    });
  };

  return (
    <Box position="relative">
      {/* El motor es puro CSS: scroll-snap */}
      <Flex
        ref={scrollRef}
        overflowX="auto"
        css={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {slides.map((slide, i) => (
          <Box key={i} flex="0 0 100%" style={{ scrollSnapAlign: "start" }}>
            <HeroSlideContent slide={slide} priority={i === 0} />
          </Box>
        ))}
      </Flex>

      {/* Puntitos manuales */}
      <Flex justify="center" gap={2} mt={4}>
        {slides.map((_, i) => (
          <Box
            key={i}
            as="button"
            onClick={() => scrollTo(i)}
            w={index === i ? "20px" : "8px"}
            h="8px"
            borderRadius="full"
            bg={index === i ? "brand.default" : "neutral.300"}
            transition="all 0.3s"
          />
        ))}
      </Flex>
    </Box>
  );
}
