"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { SliderAlt, ArrowDownUp } from "@boxicons/react";
import { useSearchFilterBar } from "../hooks/useSearchFilterBar";

const FilterDrawer = dynamic(
  () => import("./FilterDrawer").then((mod) => mod.FilterDrawer),
  { ssr: false },
);

const SortModal = dynamic(
  () => import("./SortModal").then((mod) => mod.SortModal),
  { ssr: false },
);

export function SearchFilterBar() {
  const {
    filterOpen,
    setFilterOpen,
    sortOpen,
    setSortOpen,
    hasFilters,
    currentSortLabel,
  } = useSearchFilterBar();

  return (
    <>
      <Box
        display={{ base: "flex", md: "none" }}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="neutral.200"
      >
        {/* Botón de Filtros */}
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

        {/* Botón de Ordenamiento */}
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
            {currentSortLabel}
          </Text>
        </Flex>
      </Box>

      {filterOpen && (
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
      )}
      {sortOpen && (
        <SortModal open={sortOpen} onClose={() => setSortOpen(false)} />
      )}
    </>
  );
}
