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
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}>
        <Box w="100%" h="45vw" maxH="400px" overflow="hidden">
          <Image
            src={slide.image}
            alt={slide.title}
            width={1200}
            height={800}
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
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

        <Box w="60%" h="100%" flexShrink={0} overflow="hidden">
          <Image
            src={slide.image}
            alt={slide.title}
            width={1800}
            height={800}
            sizes="(max-width: 868px) 100vw, 70vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
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
