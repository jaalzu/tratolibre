"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("keywords") ?? "");
  const [isHovered, setIsHovered] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 300);
  const shouldFetchSuggestions = debouncedQuery.length >= 2;

  const {
    data: suggestions = [],
    isFetching: isFetchingSuggestions,
    isError: hasSuggestionsError,
  } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      const result = await getItems({
        query: debouncedQuery,
        limit: 5,
      });

      if (!result.success) {
        throw new Error("Error cargando sugerencias");
      }

      return result.data;
    },
    enabled: shouldFetchSuggestions,
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("keywords", query.trim());
    router.push(`/search?${params.toString()}`);
    setIsSuggestionsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return {
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
  };
}
