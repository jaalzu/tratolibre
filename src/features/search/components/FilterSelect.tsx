"use client";

import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { ChevronUp, ChevronDown, Check, Search } from "@boxicons/react";
import { useFilterSelect } from "../hooks/useFilterSelect";
import { useEffect, useState, useRef } from "react";

interface Option { id: string; label: string; }
interface FilterSelectProps { value: string; onChange: (value: string) => void; options: Option[]; placeholder: string; searchable?: boolean; }

export function FilterSelect({ value, onChange, options, placeholder, searchable }: FilterSelectProps) {
  const { open, ref, selected, toggle, close } = useFilterSelect(value, options);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filtered = searchable && query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const items: Option[] = [{ id: "", label: placeholder } as Option, ...filtered];

  useEffect(() => {
    if (open) {
      setQuery("");
      setFocusedIndex(-1);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isSearchInput = target.tagName === "INPUT";
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        toggle();
      }
      return;
    }
    if (isSearchInput && e.key.length === 1) return;
    if (e.key === "Escape") { e.preventDefault(); close(); (ref.current?.querySelector("button") as HTMLElement)?.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex((p) => Math.min(p + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (focusedIndex >= 0) { const opt = items[focusedIndex]; onChange(opt.id); close(); } }
    else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) setFocusedIndex((p) => Math.max(p - 1, 0));
      else setFocusedIndex((p) => Math.min(p + 1, items.length - 1));
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0) {
      const el = document.getElementById(`fs-opt-${focusedIndex}`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <Box position="relative" ref={ref} onKeyDown={handleKeyDown}>
      <Flex as="button" w="full" align="center" justify="space-between" px={3} h="38px" border="1px solid" borderColor="neutral.200" borderRadius="lg" borderBottomRadius={open ? "0" : "lg"} bg="white" cursor="pointer" onClick={toggle} aria-haspopup="listbox" aria-expanded={open} transition="border-color 0.15s">
        <Text fontSize="sm" color="neutral.600" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex={1} textAlign="left">{selected ? selected.label : placeholder}</Text>
        {open ? <ChevronUp width="18px" height="18px" fill="var(--chakra-colors-neutral-400)" /> : <ChevronDown width="18px" height="18px" fill="var(--chakra-colors-neutral-400)" />}
      </Flex>

      {open && (
        <Box position="absolute" top="38px" left={0} right={0} bg="white" border="1px solid" borderColor="neutral.200" borderTop="none" borderBottomRadius="lg" borderTopRadius="0" boxShadow="lg" maxH="260px" display="flex" flexDirection="column" zIndex={50} css={{ isolation: "isolate" }}>
          {searchable && (
            <Flex align="center" gap={2} px={3} py={2} borderBottom="1px solid" borderColor="neutral.100">
              <Search width="16px" height="16px" fill="var(--chakra-colors-neutral-400)" />
              <Input placeholder="Buscar provincia..." value={query} onChange={(e) => setQuery(e.target.value)} size="sm" border="none" _focus={{ boxShadow: "none" }} px={0} h="28px" fontSize="sm" autoFocus />
            </Flex>
          )}
          <Box overflowY="auto" flex={1} tabIndex={-1} ref={listRef} role="listbox" aria-label={placeholder} outline="none" css={{ scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": { display: "none" } }}>
            {items.map((opt, idx) => {
              const isSelected = value === opt.id;
              const isPlaceholder = opt.id === "";
              const focused = idx === focusedIndex;
              return (
                <Box key={opt.id + idx} id={`fs-opt-${idx}`} as="button" w="full" textAlign="left" px={3} py={2} role="option" aria-selected={isSelected} bg={focused ? "neutral.50" : isSelected ? "brand.subtle" : "transparent"} _hover={{ bg: isSelected ? "brand.subtle" : "neutral.50" }} onClick={() => { onChange(opt.id); close(); }} tabIndex={-1}>
                  <Flex align="center" justify="space-between">
                    <Text fontSize="sm" color={isPlaceholder ? "neutral.400" : isSelected ? "brand.default" : "neutral.600"} fontWeight={isSelected ? "bold" : "normal"}>{opt.label}</Text>
                    {isSelected && !isPlaceholder && <Check width="16px" height="16px" fill="var(--chakra-colors-brand-default)" />}
                  </Flex>
                </Box>
              );
            })}
            {filtered.length === 0 && searchable && <Text fontSize="sm" color="neutral.400" px={3} py={3}>Sin resultados</Text>}
          </Box>
        </Box>
      )}
    </Box>
  );
}
