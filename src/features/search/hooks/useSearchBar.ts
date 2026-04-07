"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSearchBar() {
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

  return {
    query,
    setQuery,
    isHovered,
    setIsHovered,
    handleSearch,
    handleKeyDown,
  };
}
