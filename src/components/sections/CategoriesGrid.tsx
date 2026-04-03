"use client";

import { Box, Grid, Text, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import {
  ChevronUp,
  ChevronDown,
  // Hanger en lugar de Closet
  Hanger,
} from "@boxicons/react";

const INITIAL_COUNT = 6;

export function CategoriesGrid() {
  const [expanded, setExpanded] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visible = expanded ? CATEGORIES : CATEGORIES.slice(0, INITIAL_COUNT);

  return (
    <PageContainer py={4}>
      <Box
        ref={containerRef}
        bg="neutral.50"
        borderRadius="2xl"
        p={4}
        shadow="base"
        minH={!isNear ? "150px" : "auto"}
      >
        {!isNear ? null : (
          <>
            <Text fontWeight="bold" fontSize="md" color="neutral.900" mb={3}>
              Categorías
            </Text>

            <Box
              borderTop="1px solid"
              borderColor="neutral.100"
              mb={3}
              mx={-4}
            />

            <Grid templateColumns="repeat(3, 1fr)" gap={2} py={2}>
              {visible.map((cat) => {
                // Usamos 'icon' que es donde tenés el componente según el error de TS
                const Icon = cat.icon;

                return (
                  <NextLink key={cat.id} href={`/category/${cat.id}`}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                      h="80px"
                      borderRadius="xl"
                      bg="neutral.150"
                      _hover={{ bg: "brand.50" }}
                      transition="all 0.15s"
                      cursor="pointer"
                      textAlign="center"
                    >
                      <Icon
                        width="24px"
                        height="24px"
                        fill="var(--chakra-colors-brand-default)"
                      />
                      <Text
                        fontSize="xs"
                        color="neutral.700"
                        fontWeight="medium"
                        lineHeight="tight"
                      >
                        {cat.label}
                      </Text>
                    </Box>
                  </NextLink>
                );
              })}
            </Grid>

            <Box
              borderTop="1px solid"
              borderColor="neutral.100"
              mt={3}
              mx={-4}
            />

            <Flex
              as="button"
              onClick={() => setExpanded(!expanded)}
              w="full"
              pt={3}
              align="center"
              gap={1}
            >
              <Text fontSize="sm" color="accent.default" fontWeight="semibold">
                {expanded
                  ? "Mostrar menos categorías"
                  : "Ver todas las categorías"}
              </Text>
              {expanded ? (
                <ChevronUp
                  width="16px"
                  height="16px"
                  fill="var(--chakra-colors-accent-default)"
                />
              ) : (
                <ChevronDown
                  width="16px"
                  height="16px"
                  fill="var(--chakra-colors-accent-default)"
                />
              )}
            </Flex>
          </>
        )}
      </Box>
    </PageContainer>
  );
}
