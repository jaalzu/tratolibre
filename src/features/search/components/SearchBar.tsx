"use client";

import { Flex, Input, chakra } from "@chakra-ui/react";
import { Search } from "@boxicons/react";
import { useSearchBar } from "../hooks/useSearchBar";

export function SearchBar() {
  const {
    query,
    setQuery,
    isHovered,
    setIsHovered,
    handleSearch,
    handleKeyDown,
  } = useSearchBar();

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
