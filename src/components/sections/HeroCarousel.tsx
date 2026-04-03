// components/sections/HeroCarousel.tsx
"use client";

import { Box, Flex } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { HeroSlideContent } from "./Hero";

interface HeroSlide {
  image: string;
  title: string;
  buttonLabel: string;
  buttonHref: string;
  bg: string;
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <Box overflow="hidden" ref={emblaRef}>
      <Flex>
        {slides.map((slide, i) => (
          <Box key={i} flex="0 0 100%" minW={0}>
            <HeroSlideContent slide={slide} priority={i === 0} />
          </Box>
        ))}
      </Flex>
      <Flex justify="center" gap={2} mt={4} mb={1}>
        {slides.map((_, i) => (
          <Box
            key={i}
            as="button"
            aria-label={`Ir a slide ${i + 1}`}
            w={selectedIndex === i ? "20px" : "8px"}
            h="8px"
            borderRadius="full"
            bg={selectedIndex === i ? "brand.default" : "neutral.300"}
            transition="all 0.3s ease"
            onClick={() => scrollTo(i)}
            cursor="pointer"
            border="none"
            p={0}
          />
        ))}
      </Flex>
    </Box>
  );
}
