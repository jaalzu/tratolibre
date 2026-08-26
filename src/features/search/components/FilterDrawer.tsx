"use client";

import { Box, Flex, Text, Stack, IconButton } from "@chakra-ui/react";
import { X } from "@boxicons/react";
import { useState } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { DATE_OPTIONS, SORT_OPTIONS } from "../constants";
import { Button } from "@/shared/components/ui/Button";
import { FilterSelect } from "./FilterSelect";
import { FilterRow, OptionButton } from "./filters/FilterAtoms";
import { PriceInput } from "./filters/PriceInput";

interface FilterDrawerProps { open: boolean; onClose: () => void; }

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } = useSearchFilters();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setExpanded((p) => (p[k] ? {} : { [k]: true }));

  const catLabel = CATEGORIES.find((c) => c.id === filters.category)?.label ?? "Todas";
  const provLabel = filters.province || "Todas las provincias";
  const priceLabel = (() => {
    if (!filters.minPrice && !filters.maxPrice) return "Sin límite";
    const fmt = (v: string) => `$${Number(v.replace(/\D/g, "")).toLocaleString("es-AR")}`;
    if (filters.minPrice && filters.maxPrice) return `${fmt(filters.minPrice)}–${fmt(filters.maxPrice)}`;
    if (filters.minPrice) return `Desde ${fmt(filters.minPrice)}`;
    return `Hasta ${fmt(filters.maxPrice)}`;
  })();
  const dateLabel = DATE_OPTIONS.find((d) => d.id === filters.date)?.label ?? "Cualquier fecha";
  const condLabel = CONDITIONS.find((c) => c.id === filters.condition)?.label ?? "Todos";
  const sortLabel = SORT_OPTIONS.find((s) => s.id === filters.orderBy)?.label ?? "Más recientes";

  return (
    <>
      {open && <Box position="fixed" inset={0} bg="blackAlpha.500" css={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} zIndex={200} onClick={onClose} />}
      <Box position="fixed" top={0} left={0} h="100dvh" w="300px" bg="white" zIndex={201} transform={open ? "translateX(0)" : "translateX(-100%)"} transition="transform 0.25s ease" display="flex" flexDirection="column" boxShadow="base">
        <Flex align="center" justify="space-between" px={4} py={3} borderBottom="1px solid" borderColor="neutral.100">
          <Text fontWeight="bold" fontSize="md" color="neutral.900">Filtros</Text>
          <IconButton variant="ghost" onClick={onClose} aria-label="close"><X width="20px" height="20px" fill="var(--chakra-colors-neutral-500)" /></IconButton>
        </Flex>

        <Box overflowY="auto" flex={1} px={3} pt="5px" pb="5px" css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          <FilterRow label="Ordenar por" value={sortLabel} expanded={!!expanded.orderBy} onToggle={() => toggle("orderBy")}>
            <Stack gap={1}>{SORT_OPTIONS.map((o) => <OptionButton key={o.id} label={o.label} active={filters.orderBy === o.id} onClick={() => setFilter("orderBy", o.id)} />)}</Stack>
          </FilterRow>
          <FilterRow label="Categoría" value={catLabel} expanded={!!expanded.category} onToggle={() => toggle("category")}>
            <FilterSelect value={filters.category} onChange={(v) => setFilter("category", v)} options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} placeholder="Todas" />
          </FilterRow>
          <FilterRow label="Ubicación" value={provLabel} expanded={!!expanded.province} onToggle={() => toggle("province")}>
            <FilterSelect searchable value={filters.province} onChange={(v) => setFilter("province", v)} options={provinces.map((p) => ({ id: p.nombre, label: p.nombre }))} placeholder="Todas las provincias" />
          </FilterRow>
          <FilterRow label="Precio" value={priceLabel} expanded={!!expanded.price} onToggle={() => toggle("price")}>
            <Flex gap={2} align="center">
              <PriceInput label="Mínimo" value={filters.minPrice} onChange={(v) => setFilter("minPrice", v)} placeholder="$ 0" />
              <Text color="neutral.400" mt={4}>—</Text>
              <PriceInput label="Máximo" value={filters.maxPrice} onChange={(v) => setFilter("maxPrice", v)} placeholder="$ ∞" />
            </Flex>
          </FilterRow>
          <FilterRow label="Fecha" value={dateLabel} expanded={!!expanded.date} onToggle={() => toggle("date")}>
            <Stack gap={1}>{DATE_OPTIONS.map((d) => <OptionButton key={d.id} label={d.label} active={filters.date === d.id} onClick={() => toggleFilter("date", d.id)} />)}</Stack>
          </FilterRow>
          <FilterRow label="Estado" value={condLabel} expanded={!!expanded.condition} onToggle={() => toggle("condition")} hideDivider>
            <Stack gap={1}>{CONDITIONS.map((c) => <OptionButton key={c.id} label={c.label} active={filters.condition === c.id} onClick={() => toggleFilter("condition", c.id)} />)}</Stack>
          </FilterRow>
        </Box>

        <Flex gap={2} px={4} py={3} borderTop="1px solid" borderColor="neutral.100" bg="white">
          <Button variant="ghost" flex={1} h="44px" onClick={() => clear(onClose)}>Limpiar</Button>
          <Button flex={1} h="44px" onClick={() => apply(onClose)}>Mostrar resultados</Button>
        </Flex>
      </Box>
    </>
  );
}
