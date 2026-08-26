"use client";

import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { DATE_OPTIONS, SORT_OPTIONS } from "../constants";
import { Button } from "@/shared/components/ui/Button";
import { FilterSelect } from "./FilterSelect";
import { FilterRow, OptionButton } from "./filters/FilterAtoms";
import { PriceInput } from "./filters/PriceInput";

export function FilterPanel() {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } = useSearchFilters();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setOpen((p) => (p[k] ? {} : { [k]: true }));

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
    <Box
      w="280px"
      flexShrink={0}
      display={{ base: "none", lg: "flex" }}
      flexDirection="column"
      position="sticky"
      top="76px"
      alignSelf="flex-start"
      bg="bg.card"
      boxShadow="base"
      borderRadius="lg"
      maxH="calc(100dvh - 84px)"
      overflowY="auto"
      css={{ scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Flex align="center" justify="space-between" px={4} pt={4} pb={3} borderBottom="1px solid" borderColor="neutral.100">
        <Text fontWeight="bold" fontSize="sm" color="neutral.900">Filtros</Text>
        <Box as="button" onClick={() => clear()} color="neutral.400" fontSize="xs" _hover={{ color: "neutral.600" }}>Limpiar</Box>
      </Flex>

      <Box px={3} pt="5px" pb={4} flex={1}>
        <FilterRow label="Ordenar por" value={sortLabel} expanded={!!open.orderBy} onToggle={() => toggle("orderBy")}>
          <Stack gap={1}>
            {SORT_OPTIONS.map((o) => (
              <OptionButton key={o.id} label={o.label} active={filters.orderBy === o.id} onClick={() => setFilter("orderBy", o.id)} />
            ))}
          </Stack>
        </FilterRow>
        <FilterRow label="Categoría" value={catLabel} expanded={!!open.category} onToggle={() => toggle("category")}>
          <FilterSelect value={filters.category} onChange={(v) => setFilter("category", v)} options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))} placeholder="Todas" />
        </FilterRow>

        <FilterRow label="Ubicación" value={provLabel} expanded={!!open.province} onToggle={() => toggle("province")}>
          <FilterSelect searchable value={filters.province} onChange={(v) => setFilter("province", v)} options={provinces.map((p) => ({ id: p.nombre, label: p.nombre }))} placeholder="Todas las provincias" />
        </FilterRow>

        <FilterRow label="Precio" value={priceLabel} expanded={!!open.price} onToggle={() => toggle("price")}>
          <Flex gap={2} align="center">
            <PriceInput label="Mínimo" value={filters.minPrice} onChange={(v) => setFilter("minPrice", v)} placeholder="$ 0" />
            <Text color="neutral.400" mt={4}>—</Text>
            <PriceInput label="Máximo" value={filters.maxPrice} onChange={(v) => setFilter("maxPrice", v)} placeholder="$ ∞" />
          </Flex>
        </FilterRow>

        <FilterRow label="Fecha" value={dateLabel} expanded={!!open.date} onToggle={() => toggle("date")}>
          <Stack gap={1}>
            {DATE_OPTIONS.map((d) => (
              <OptionButton key={d.id} label={d.label} active={filters.date === d.id} onClick={() => toggleFilter("date", d.id)} />
            ))}
          </Stack>
        </FilterRow>

        <FilterRow label="Estado" value={condLabel} expanded={!!open.condition} onToggle={() => toggle("condition")} hideDivider>
          <Stack gap={1}>
            {CONDITIONS.map((c) => (
              <OptionButton key={c.id} label={c.label} active={filters.condition === c.id} onClick={() => toggleFilter("condition", c.id)} />
            ))}
          </Stack>
        </FilterRow>
      </Box>

      <Box px={4} py={3} borderTop="1px solid" borderColor="neutral.100" bg="bg.card" position="sticky" bottom={0}>
        <Button w="full" h="44px" onClick={() => apply()}>Mostrar resultados</Button>
      </Box>
    </Box>
  );
}
