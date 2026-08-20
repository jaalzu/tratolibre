"use client";

import {
  Box,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  chakra,
} from "@chakra-ui/react";
import { Search } from "@boxicons/react";
import NextLink from "next/link";
import { useSearchBar } from "../hooks/useSearchBar";

export function SearchBar() {
  const {
    query,
    setQuery,
    isHovered,
    setIsHovered,
    suggestions,
    isSuggestionsOpen,
    isFetchingSuggestions,
    hasSuggestionsError,
    shouldFetchSuggestions,
    setIsSuggestionsOpen,
    handleSearch,
    handleKeyDown,
  } = useSearchBar();

  return (
    <Flex
      w="calc(100% + 2px)"
      align="center"
      bg="neutral.50"
      borderRadius="2px"
      h="35px"
      overflow="hidden"
    >
      <Input
        placeholder="Buscar en tratolibre"
        aria-label="Buscar en tratolibre"
        ps="2"
        h="36px"
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
        height="26px"
        px="12px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderLeft="1px solid"
        borderColor="neutral.200"
        ml="1px"
        bg="transparent"
        cursor="pointer"
        flexShrink={0}
        transition="all 0.2s"
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
