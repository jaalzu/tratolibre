"use client";

import { Box, Flex, Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("keywords") ?? "");

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
    >
      <Input
        placeholder="Buscar en tratolibre"
        ps="4"
        h="32px"
        fontSize="sm"
        bg="transparent"
        color="neutral.900"
        border="none"
        borderRadius="0"
        _focus={{ shadow: "none" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        flex={1}
      />
      <button
        type="button"
        aria-label="Buscar"
        onClick={handleSearch}
        style={{
          height: "32px",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid var(--chakra-colors-neutral-200)",
          background: "transparent",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.querySelector("i") as HTMLElement).style.color =
            "var(--chakra-colors-brand-default)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.querySelector("i") as HTMLElement).style.color =
            "var(--chakra-colors-neutral-500)";
        }}
      >
        <i
          className="bx bx-search"
          style={{
            fontSize: "18px",
            color: "var(--chakra-colors-neutral-500)",
            transition: "color 0.15s",
          }}
        />
      </button>
    </Flex>
  );
}
