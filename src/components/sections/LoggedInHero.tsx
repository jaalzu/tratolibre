"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";

interface LoggedInHeroProps {
  name: string | null;
}

export function LoggedInHero({ name }: LoggedInHeroProps) {
  const firstName = name
    ? name.split(" ")[0].charAt(0).toUpperCase() +
      name.split(" ")[0].slice(1).toLowerCase()
    : null;

  return (
    <Box px={{ base: 3, md: 8 }} pt={3} pb={1}>
      <Flex
        bg="neutral.50"
        borderRadius="2xl"
        px={{ base: 2, md: 8 }}
        py={{ base: 10, md: 12 }}
        maxW="1200px"
        mx="auto"
        direction="column"
        align="center"
        textAlign="center"
        shadow="base"
        gap={7}
      >
        <Box>
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="neutral.900"
            mb={1}
          >
            {firstName ? `Bienvenido, ${firstName}` : "Bienvenido"}{" "}
          </Heading>
          <Text fontSize="md" color="fg.muted" px={5}>
            Encontrá lo que buscás o publicá lo que ya no usás.
          </Text>
          <Text fontSize="md" color="fg.muted">
            Gratis, simple y rápido.
          </Text>
        </Box>

        <Flex gap={5} flexWrap="wrap" justify="center">
          <Button
            asChild
            size="sm"
            bg="neutral.50"
            color="black"
            border="1px solid"
            borderColor="neutral.500"
            px={{ base: 8, md: 12 }}
            py={{ base: 1.5, md: 2 }}
            fontSize={{ base: "sm", md: "md" }}
            _hover={{ bg: "neutral.100" }}
          >
            <NextLink href="/search">Explorar</NextLink>
          </Button>
          <Button
            asChild
            size="sm"
            px={{ base: 8, md: 12 }}
            py={{ base: 1.5, md: 2 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <NextLink href="/item/new">Vender</NextLink>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
