"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { SliderAlt, ArrowDownUp } from "@boxicons/react";

const FilterDrawer = dynamic(
  () => import("./FilterDrawer").then((mod) => mod.FilterDrawer),
  {
    ssr: false,
  },
);

const SortModal = dynamic(
  () => import("./SortModal").then((mod) => mod.SortModal),
  {
    ssr: false,
  },
);

const SORT_LABELS: Record<string, string> = {
  closest: "Más recientes",
  most_relevance: "Más relevantes",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
};

export function SearchFilterBar() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const searchParams = useSearchParams();

  const orderBy = searchParams.get("order_by") ?? "closest";
  const hasFilters = [
    "category",
    "province",
    "date",
    "condition",
    "min_price",
    "max_price",
  ].some((k) => searchParams.has(k));

  return (
    <>
      <Box
        display={{ base: "flex", md: "none" }}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="neutral.200"
      >
        <Flex
          as="button"
          flex={1}
          align="center"
          justify="center"
          gap={2}
          py={3}
          borderRight="1px solid"
          borderColor="neutral.200"
          onClick={() => setFilterOpen(true)}
          _hover={{ bg: "neutral.50" }}
          position="relative"
        >
          <SliderAlt
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-600)"
          />
          <Text fontSize="sm" fontWeight="medium" color="neutral.700">
            Filtros
          </Text>
          {hasFilters && (
            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="brand.default"
              position="absolute"
              top="8px"
              right="calc(50% - 32px)"
            />
          )}
        </Flex>

        <Flex
          as="button"
          flex={1}
          align="center"
          justify="center"
          gap={2}
          py={3}
          onClick={() => setSortOpen(true)}
          _hover={{ bg: "neutral.50" }}
        >
          <ArrowDownUp
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-600)"
          />
          <Text fontSize="sm" fontWeight="medium" color="neutral.700">
            {SORT_LABELS[orderBy]}
          </Text>
        </Flex>
      </Box>

      {/* 3. Solo se renderizan (y descargan) si el estado es true */}
      {filterOpen && (
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
      )}
      {sortOpen && (
        <SortModal open={sortOpen} onClose={() => setSortOpen(false)} />
      )}
    </>
  );
}
