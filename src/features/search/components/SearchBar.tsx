"use client";

import { Box, Flex, Input, chakra } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "@boxicons/react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("keywords") ?? "");
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("keywords", query.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Flex
      w="full"
      align="center"
      bg="neutral.50"
      borderRadius="full"
      h="32px"
      overflow="hidden"
      border="1px solid"
      borderColor="neutral.200"
    >
      <Input
        placeholder="Buscar en tratolibre"
        ps="4"
        h="32px"
        fontSize="sm"
        bg="transparent"
        color="neutral.900"
        border="none"
        outline="none"
        _focus={{ shadow: "none" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        flex={1}
      />

      <chakra.button
        type="button"
        aria-label="Buscar"
        onClick={handleSearch}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        height="32px"
        px="12px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderLeft="1px solid"
        borderColor="neutral.200"
        bg="transparent"
        cursor="pointer"
        flexShrink={0}
        transition="all 0.2s"
        _hover={{ bg: "neutral.100" }}
      >
        <Search
          // En lugar de size="18px", usamos width y height que son SVGProps estándar
          width="18px"
          height="18px"
          fill={
            isHovered
              ? "var(--chakra-colors-brand-default)"
              : "var(--chakra-colors-neutral-500)"
          }
          style={{ transition: "fill 0.15s" }}
        />
      </chakra.button>
    </Flex>
  );
}
