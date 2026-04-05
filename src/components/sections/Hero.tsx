// components/sections/Hero.tsx
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import NextLink from "next/link";
import { HeroCarousel } from "./HeroCarousel";

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

export function HeroSlideContent({
  slide,
  priority,
}: {
  slide: HeroSlide;
  priority?: boolean;
}) {
  return (
    <>
      {/* Mobile - La imagen SÍ ocupa 100vw */}
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

      {/* Desktop - La imagen solo ocupa 60% del viewport */}
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
            sizes="60vw" // ✅ FIX: Solo 60vw en desktop, no "100vw"
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

  return <HeroCarousel slides={slides} />;
}
