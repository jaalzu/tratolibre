"use client";

import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { Heart, Leaf, Group, Rocket } from "@boxicons/react";

const values = [
  {
    Icon: Heart,
    title: "Comunidad primero",
    description:
      "Creemos que las mejores transacciones nacen de la confianza entre personas.",
  },
  {
    Icon: Leaf,
    title: "Consumo responsable",
    description: "Darle una segunda vida a los objetos reduce el desperdicio.",
  },
  {
    Icon: Group,
    title: "Acceso para todos",
    description: "Queremos que cualquier persona en Argentina pueda comprar.",
  },
  {
    Icon: Rocket,
    title: "Simplicidad",
    description:
      "Publicar un artículo toma minutos. Contactar al vendedor, segundos.",
  },
];

export default function WhoWeAreContent() {
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
            Quiénes somos
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="fg.muted"
            maxW="2xl"
            mx="auto"
          >
            Un marketplace argentino hecho por personas que creen en el poder de
            las comunidades y el consumo consciente.
          </Text>
        </Box>

        {/* MISIÓN */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          mb={3}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="brand.fg"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
          >
            Nuestra misión
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="semibold"
            color="fg"
            mb={4}
          >
            Conectar personas a través de objetos con historia
          </Heading>
          <Stack gap={4} color="fg.muted" lineHeight="tall">
            <Text>
              TratoLibre nació con una idea simple: que los objetos que ya no
              usás pueden ser exactamente lo que otra persona está buscando...
            </Text>
            <Text>
              Creamos una plataforma donde comprar, vender e intercambiar
              objetos usados sea tan fácil como hablar con un vecino...
            </Text>
          </Stack>
        </Box>

        {/* VALORES */}
        <Box
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 10 }}
          py={{ base: 8, md: 12 }}
          mb={3}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="brand.fg"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Lo que nos guía
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="semibold"
            color="fg"
            mb={8}
          >
            Nuestros valores
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            {values.map((v) => {
              const ValueIcon = v.Icon;
              return (
                <Flex
                  key={v.title}
                  gap={4}
                  p={5}
                  bg="neutral.150"
                  borderRadius="2xl"
                  align="flex-start"
                >
                  <Flex
                    flexShrink={0}
                    w={10}
                    h={10}
                    bg="brand.subtle"
                    color="brand.default"
                    borderRadius="lg"
                    align="center"
                    justify="center"
                  >
                    <ValueIcon width="20px" height="20px" fill="currentColor" />
                  </Flex>
                  <Box>
                    <Text fontWeight="semibold" color="fg" mb={1}>
                      {v.title}
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                      {v.description}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        </Box>

        {/* CONTACTO */}
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
            ¿Tenés alguna pregunta o sugerencia?
          </Heading>
          <Text color="fg.muted" mb={6}>
            Nos importa saber qué pensás. Tu feedback nos ayuda a mejorar la
            plataforma todos los días.
          </Text>
          <Link
            href="mailto:contacto@tratolibre.com"
            px={6}
            py={3}
            bg="brand.default"
            color="white"
            borderRadius="lg"
            fontWeight="semibold"
            fontSize="sm"
            _hover={{ bg: "brand.hover" }}
            transition="background 0.2s"
            display="inline-block"
          >
            Contactanos
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
