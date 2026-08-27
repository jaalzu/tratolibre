"use client";

import dynamic from "next/dynamic";
import { Box, Flex } from "@chakra-ui/react";

function Bone({ w = "100%", h = "16px", borderRadius = "md" }: { w?: string; h?: string; borderRadius?: string }) {
  return (
    <Box w={w} h={h} bg="neutral.100" borderRadius={borderRadius} style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

function FilterPanelSkeletonInline() {
  return (
    <>
      <Box
        w="280px"
        flexShrink={0}
        bg="bg.card"
        boxShadow="base"
        borderRadius="lg"
        p={4}
        display={{ base: "none", lg: "block" }}
      >
        <Flex align="center" justify="space-between" mb={3} pb={3} borderBottom="1px solid" borderColor="neutral.100">
          <Bone w="50px" h="16px" />
          <Bone w="40px" h="12px" />
        </Flex>
        {[...Array(6)].map((_, i) => (
          <Flex
            key={i}
            align="center"
            justify="space-between"
            py={3}
            borderBottom={i === 5 ? "none" : "1px solid"}
            borderColor="neutral.100"
          >
            <Bone w={`${70 + (i % 2) * 20}px`} h="14px" />
            <Bone w="80px" h="12px" borderRadius="full" />
          </Flex>
        ))}
        <Box mt={3} pt={3} borderTop="1px solid" borderColor="neutral.100">
          <Bone h="44px" borderRadius="full" />
        </Box>
      </Box>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </>
  );
}

export const DynamicFilterPanel = dynamic(() => import("./FilterPanel").then((mod) => mod.FilterPanel), {
  ssr: false,
  loading: () => <FilterPanelSkeletonInline />,
});
