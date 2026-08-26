"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { SliderAlt } from "@boxicons/react";
import { useSearchFilterBar } from "../hooks/useSearchFilterBar";
import { useSearchParams } from "next/navigation";

const FilterDrawer = dynamic(() => import("./FilterDrawer").then((m) => m.FilterDrawer), { ssr: false });

export function SearchFilterBar() {
  const { filterOpen, setFilterOpen } = useSearchFilterBar();
  const sp = useSearchParams();
  const count = ["category","province","min_price","max_price","date","condition"].filter((k) => sp.get(k)).length;

  return (
    <>
      {/* Mobile */}
      <Box display={{ base: "flex", md: "none" }} borderTop="1px solid" borderBottom="1px solid" borderColor="neutral.200">
        <Flex as="button" w="full" align="center" justify="center" gap={1} py={3} minW={0} onClick={() => setFilterOpen(true)} _hover={{ bg: "neutral.50" }}>
          <SliderAlt width="16px" height="16px" fill="var(--chakra-colors-accent-default)" />
          <Text fontSize="sm" fontWeight="medium" color="accent.default" whiteSpace="nowrap">Filtrar{count ? ` · ${count}` : ""}</Text>
        </Flex>
      </Box>

      {/* Desktop / tablet controls — solo botón Filtrar en tablet */}
      <Flex display={{ base: "none", md: "flex", lg: "none" }} align="center" justify="center" px={{ md: 4, lg: 8 }} py={2}>
        <Flex as="button" align="center" gap={1.5} px={3} py={1.5} border="1px solid" borderColor="neutral.200" borderRadius="full" onClick={() => setFilterOpen(true)} _hover={{ bg: "neutral.50" }}>
          <SliderAlt width="16px" height="16px" fill="var(--chakra-colors-neutral-600)" />
          <Text fontSize="sm" fontWeight="medium" color="neutral.700">Filtrar</Text>
        </Flex>
      </Flex>

      {filterOpen && <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />}
    </>
  );
}
