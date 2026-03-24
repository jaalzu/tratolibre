"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";

const INITIAL_COUNT = 6;

export function CategoriesGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CATEGORIES : CATEGORIES.slice(0, INITIAL_COUNT);

  return (
    <PageContainer py={4}>
      <Box bg="neutral.50" borderRadius="2xl" p={4} shadow="base">
        {/* Título */}
        <Text fontWeight="bold" fontSize="md" color="neutral.900" mb={3}>
          Categorías
        </Text>

        <Box borderTop="1px solid" borderColor="neutral.100" mb={3} mx={-4} />

        {/* Grid */}
        <Grid templateColumns="repeat(3, 1fr)" gap={2} py={2}>
          {visible.map((cat) => (
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
                <i
                  className={`bx ${cat.icon}`}
                  style={{
                    fontSize: "24px",
                    color: "var(--chakra-colors-brand-default)",
                  }}
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
          ))}
        </Grid>

        {/* Divisor — ancho completo */}
        <Box borderTop="1px solid" borderColor="neutral.100" mt={3} mx={-4} />

        {/* Botón */}
        <Box
          as="button"
          onClick={() => setExpanded(!expanded)}
          w="full"
          pt={3}
          textAlign="left"
        >
          <Text fontSize="sm" color="accent.default" fontWeight="semibold">
            {expanded ? (
              <>
                Mostrar menos categorías{" "}
                <i
                  className="bx bx-chevron-up"
                  style={{ verticalAlign: "middle", fontSize: "16px" }}
                />
              </>
            ) : (
              <>
                Ver todas las categorías{" "}
                <i
                  className="bx bx-chevron-down"
                  style={{ verticalAlign: "middle", fontSize: "16px" }}
                />
              </>
            )}
          </Text>
        </Box>
      </Box>
    </PageContainer>
  );
}
