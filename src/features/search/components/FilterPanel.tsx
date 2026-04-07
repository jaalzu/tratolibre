"use client";

import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { DATE_OPTIONS, SORT_OPTIONS } from "../constants";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "./FilterSelect";
import { SectionTitle, OptionButton } from "./filters/FilterAtoms";
import { PriceInput } from "./filters/PriceInput";

export function FilterPanel() {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } =
    useSearchFilters();

  return (
    <Box
      w="220px"
      flexShrink={0}
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      position="sticky"
      top="110px"
      alignSelf="flex-start"
    >
      {/* Header del Panel */}
      <Flex align="center" justify="space-between" mb={1}>
        <Text fontWeight="bold" fontSize="sm" color="neutral.900">
          Filtros
        </Text>
        <Box
          as="button"
          onClick={() => clear()}
          color="neutral.400"
          fontSize="xs"
          transition="color 0.2s"
          _hover={{ color: "neutral.600" }}
        >
          Limpiar
        </Box>
      </Flex>

      {/* Acción Principal */}
      <Button mt={4} mb={5} p={1} onClick={() => apply()} w="full">
        Aplicar filtros
      </Button>

      <Stack gap={5}>
        {/* Ordenamiento */}
        <Box>
          <SectionTitle>ORDENAR POR</SectionTitle>
          <Stack gap={1}>
            {SORT_OPTIONS.map((o) => (
              <OptionButton
                key={o.id}
                label={o.label}
                active={filters.orderBy === o.id}
                onClick={() => setFilter("orderBy", o.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* Categorías */}
        <Box>
          <SectionTitle>CATEGORÍA</SectionTitle>
          <FilterSelect
            value={filters.category}
            onChange={(val) => setFilter("category", val)}
            options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
            placeholder="Todas"
          />
        </Box>

        {/* Ubicación (Provincias Reales) */}
        <Box>
          <SectionTitle>UBICACIÓN</SectionTitle>
          <FilterSelect
            value={filters.province}
            onChange={(val) => setFilter("province", val)}
            options={provinces.map((p) => ({
              id: p.nombre,
              label: p.nombre,
            }))}
            placeholder="Todas las provincias"
          />
        </Box>

        {/* Rango de Precios */}
        <Box>
          <SectionTitle>PRECIO</SectionTitle>
          <Flex gap={2} align="center">
            <PriceInput
              label="Mínimo"
              value={filters.minPrice}
              onChange={(v) => setFilter("minPrice", v)}
              placeholder="$ 0"
            />
            <Text color="neutral.500" mt={4}>
              —
            </Text>
            <PriceInput
              label="Máximo"
              value={filters.maxPrice}
              onChange={(v) => setFilter("maxPrice", v)}
              placeholder="$ 10M"
            />
          </Flex>
        </Box>

        {/* Temporalidad */}
        <Box>
          <SectionTitle>FECHA DE PUBLICACIÓN</SectionTitle>
          <Stack gap={1}>
            {DATE_OPTIONS.map((d) => (
              <OptionButton
                key={d.id}
                label={d.label}
                active={filters.date === d.id}
                onClick={() => toggleFilter("date", d.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* Estado del Producto */}
        <Box>
          <SectionTitle>ESTADO</SectionTitle>
          <Stack gap={1}>
            {CONDITIONS.map((c) => (
              <OptionButton
                key={c.id}
                label={c.label}
                active={filters.condition === c.id}
                onClick={() => toggleFilter("condition", c.id)}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
