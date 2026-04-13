"use client";

import { Box, Heading, Text, Flex, SimpleGrid, Link } from "@chakra-ui/react";
import { Search, MessageCode, Checks, Star } from "@boxicons/react";

const steps = [
  {
    Icon: Search,
    step: "01",
    title: "Buscá lo que necesitás",
    description:
      "Explorá miles de publicaciones usando el buscador o navegando por categorías. Filtrá por ubicación, precio, condición y más para encontrar exactamente lo que querés.",
  },
  {
    Icon: MessageCode,
    step: "02",
    title: "Contactá al vendedor",
    description:
      "¿Te interesa un artículo? Mandá un mensaje directo al vendedor a través de nuestro chat integrado. Acordá el precio, el método de pago y la forma de entrega.",
  },
  {
    Icon: Checks,
    step: "03",
    title: "Cerrá el trato",
    description:
      "Coordiná el encuentro o envío con el vendedor. TratoLibre facilita la comunicación para que el intercambio sea lo más simple posible para ambas partes.",
  },
  {
    Icon: Star,
    step: "04",
    title: "Dejá tu reseña",
    description:
      "Una vez completada la transacción, calificá tu experiencia. Las reseñas ayudan a construir una comunidad de confianza dentro de TratoLibre.",
  },
];

const reasons = [
  {
    title: "Una economía que fluye mejor",
    description:
      "Cada objeto que vendés o comprás en TratoLibre es un recurso que sigue circulando en lugar de acumularse. Así construimos una economía más dinámica, donde cada persona puede optimizar lo que tiene y acceder a lo que necesita.",
  },
  {
    title: "Menos desperdicio, más sentido",
    description:
      "Darle una segunda vida a los objetos reduce el impacto ambiental y el consumo innecesario. Cada trato en TratoLibre es una pequeña decisión que suma a un estilo de vida más consciente.",
  },
  {
    title: "Gratis, siempre",
    description:
      "Publicar en TratoLibre no tiene costo. Lo que acordás con el vendedor es lo que pagás, sin comisiones ni sorpresas. Creemos que acceder a un buen marketplace no debería tener precio.",
  },
  {
    title: "Una comunidad que se cuida",
    description:
      "Las reseñas y calificaciones entre usuarios construyen confianza real. Cada buen trato fortalece la comunidad y hace que la siguiente transacción sea más fácil para todos.",
  },
];

export default function HowItWorksContent() {
  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Box maxW="1200px" mx="auto">
        {/* HERO */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          textAlign="center"
          mb={3}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="brand.hover"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
          >
            TratoLibre
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            color="fg"
            lineHeight="tight"
            mb={4}
          >
            ¿Cómo funciona?
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="fg.muted"
            maxW="2xl"
            mx="auto"
          >
            Comprar, vender e intercambiar objetos usados nunca fue tan simple.
            En cuatro pasos podés cerrar tu primer trato.
          </Text>
        </Box>

        {/* STEPS */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          mb={3}
        >
          <Heading
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="fg"
            mb={8}
          >
            Compra y vende en 4 sencillos pasos
          </Heading>

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 8, md: 4 }}
            align="flex-start"
          >
            {steps.map((s, i) => {
              const StepIcon = s.Icon;
              return (
                <Flex
                  key={s.step}
                  flex={1}
                  direction={{ base: "row", md: "column" }}
                  gap={4}
                  align="flex-start"
                  position="relative"
                >
                  {/* Conectores */}
                  {i < steps.length - 1 && (
                    <Box
                      display={{ base: "none", md: "block" }}
                      position="absolute"
                      top="21px"
                      left="56px"
                      right="-16px"
                      height="2px"
                      bg="border.subtle"
                      zIndex={0}
                    />
                  )}
                  {i < steps.length - 1 && (
                    <Box
                      display={{ base: "block", md: "none" }}
                      position="absolute"
                      left="21px"
                      top="44px"
                      bottom="-32px"
                      width="2px"
                      bg="border.subtle"
                      zIndex={0}
                    />
                  )}

                  <Flex
                    flexShrink={0}
                    w="44px"
                    h="44px"
                    bg="brand.default"
                    color="white"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    zIndex={1}
                  >
                    <StepIcon width="20px" height="20px" fill="white" />
                  </Flex>

                  <Box flex={1}>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color="brand.fg"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={1}
                    >
                      Paso {s.step}
                    </Text>
                    <Heading
                      as="h3"
                      fontSize={{ base: "md", md: "sm" }}
                      fontWeight="semibold"
                      color="fg"
                      mb={2}
                    >
                      {s.title}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                      {s.description}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* POR QUÉ TRATOLIBRE */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          mb={3}
        >
          <Heading
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="fg"
            mb={2}
          >
            ¿Por qué TratoLibre?
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={8} maxW="2xl">
            Comprando lo que necesitás y vendiendo lo que no usás, optimizás tus
            recursos y ayudás a otros a hacer lo mismo. Entre todos, colaboramos
            para crear una economía mejor.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            {reasons.map((r) => (
              <Box key={r.title} p={5} bg="neutral.150" borderRadius="2xl">
                <Text fontWeight="semibold" color="fg" mb={2}>
                  {r.title}
                </Text>
                <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                  {r.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA */}
        <Box
          textAlign="center"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
        >
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="semibold"
            color="fg"
            mb={3}
          >
            ¿Listo para empezar?
          </Heading>
          <Text color="fg.muted" mb={6}>
            Explorá las publicaciones o publicá lo que ya no usás en minutos.
          </Text>
          <Flex justify="center" gap={3} flexWrap="wrap">
            <Link
              href="/search"
              px={6}
              py={3}
              bg="neutral.50"
              color="neutral.900"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ textDecoration: "none", bg: "gray.100" }}
            >
              Explorar publicaciones
            </Link>
            <Link
              href="/item/new"
              px={9}
              py={3}
              bg="brand.default"
              color="white"
              borderRadius="lg"
              fontWeight="semibold"
              fontSize="sm"
              border="1px solid"
              borderColor="border"
              _hover={{ textDecoration: "none", bg: "brand.hover" }}
            >
              Publicar un artículo
            </Link>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
