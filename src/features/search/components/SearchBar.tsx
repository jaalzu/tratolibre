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
      w="full"
      align="center"
      bg="neutral.50"
      borderRadius="2px"
      h="33px"
      position="relative"
      overflow="visible"
      zIndex={20}
    >
      <Box flex={1}>
        <Input
          placeholder="Buscar en tratolibre"
          ps="2"
          h="33px"
          fontSize="sm"
          bg="transparent"
          color="neutral.900"
          border="none"
          outline="none"
          _focus={{ shadow: "none" }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsSuggestionsOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
        />

        {isSuggestionsOpen && shouldFetchSuggestions && (
          <Box
            position="absolute"
            left={0}
            right={0}
            top="calc(100% + 6px)"
            bg="white"
            border="1px solid"
            borderColor="neutral.200"
            boxShadow="lg"
            borderRadius="4px"
            overflow="hidden"
          >
            {isFetchingSuggestions ? (
              <Flex align="center" justify="center" py={3}>
                <Spinner size="sm" color="brand.default" />
              </Flex>
            ) : hasSuggestionsError ? (
              <Text px={3} py={2} color="neutral.500" fontSize="sm">
                No pudimos cargar sugerencias.
              </Text>
            ) : suggestions.length > 0 ? (
              suggestions.map((item) => (
                <NextLink
                  key={item.id}
                  href={`/item/${item.id}`}
                  onClick={() => setIsSuggestionsOpen(false)}
                >
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2}
                    _hover={{ bg: "neutral.50" }}
                  >
                    <Box
                      w="42px"
                      h="42px"
                      bg="neutral.100"
                      flexShrink={0}
                      overflow="hidden"
                    >
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      )}
                    </Box>
                    <Box minW={0}>
                      <Text
                        color="neutral.900"
                        fontSize="sm"
                        fontWeight="medium"
                        truncate
                      >
                        {item.title}
                      </Text>
                      {item.sale_price && (
                        <Text color="neutral.600" fontSize="xs">
                          ${item.sale_price.toLocaleString("es-AR")}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </NextLink>
              ))
            ) : (
              <Text px={3} py={2} color="neutral.500" fontSize="sm">
                Sin productos encontrados.
              </Text>
            )}
          </Box>
        )}
      </Box>

      <chakra.button
        type="button"
        aria-label="Buscar"
        onClick={handleSearch}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        height="33px"
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
