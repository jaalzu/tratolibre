"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import NextLink from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

interface HeroSlide {
  image: string;
  title: string;
  buttonLabel: string;
  buttonHref: string;
  bg: string;
}

function getSlides(isLoggedIn: boolean): HeroSlide[] {
  return [
    {
      image: "/hero/girl-in-pool.webp",
      title:
        "Compra, venta e intercambio de artículos de segunda mano y nuevos.",
      buttonLabel: "Vender Ahora",
      buttonHref: isLoggedIn ? "/item/new" : "/register",

      bg: "brand.100",
    },
    {
      image: "/hero/handshake.webp",
      title: "¡Es rápido, fácil y gratis!",
      buttonLabel: "Comenzar a Vender",
      buttonHref: isLoggedIn ? "/item/new" : "/register",
      bg: "accent.100",
    },
  ];
}

function HeroSlideContent({
  slide,
  priority,
}: {
  slide: HeroSlide;
  priority?: boolean;
}) {
  return (
    <>
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}>
        <Box position="relative" w="100%" h="45vw" maxH="400px">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        </Box>
        <Box bg={slide.bg} px={4} py={5}>
          <Heading fontSize="xl" fontWeight="bold" color="neutral.900" mb={6}>
            {slide.title}
          </Heading>
          <Button py={1.5} px={8} asChild>
            <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
          </Button>
        </Box>
      </Box>

      {/* Desktop */}
      <Flex display={{ base: "none", md: "flex" }} h="320px" bg={slide.bg}>
        <Flex flex={1} direction="column" justify="center" pl="12%" pr={8}>
          <Heading
            fontSize="xl"
            maxW={{ base: "100%", md: "80%" }}
            fontWeight="bold"
            color="neutral.900"
            mb={4}
          >
            {slide.title}
          </Heading>
          <Button
            asChild
            w="fit-content"
            py={1}
            px={4}
            fontSize="sm"
            borderRadius="full"
          >
            <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
          </Button>
        </Flex>
        <Box position="relative" w="60%" h="100%" flexShrink={0}>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="60vw"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        </Box>
      </Flex>
    </>
  );
}

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const slides = getSlides(isLoggedIn);
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
