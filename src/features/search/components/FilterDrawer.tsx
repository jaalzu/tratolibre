"use client";

import { Box, Flex, Text, Stack, IconButton } from "@chakra-ui/react";
import { X } from "@boxicons/react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { DATE_OPTIONS } from "../constants";
import { Button } from "@/components/ui/Button";
import { FilterSelect } from "./FilterSelect";
import { SectionTitle, OptionButton } from "./filters/FilterAtoms";
import { PriceInput } from "./filters/PriceInput";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const { filters, setFilter, toggleFilter, apply, clear, provinces } =
    useSearchFilters();

  return (
    <>
      {/* Overlay */}
      {open && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.400"
          zIndex={200}
          onClick={onClose}
        />
      )}

      {/* Drawer Content */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="100dvh"
        w="280px"
        bg="white"
        zIndex={201}
        transform={open ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.25s ease"
        display="flex"
        flexDirection="column"
        boxShadow="lg"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={2}
          borderBottom="1px solid"
          borderColor="neutral.100"
        >
          <Text fontWeight="bold" fontSize="md" color="neutral.900">
            Filtros
          </Text>
          <IconButton
            variant="ghost"
            onClick={onClose}
            aria-label="close filter menu"
          >
            <X
              width="24px"
              height="24px"
              fill="var(--chakra-colors-neutral-500)"
            />
          </IconButton>
        </Flex>

        {/* Scrollable Body */}
        <Box overflowY="auto" flex={1} px={4} py={6}>
          <Stack gap={6}>
            <Box>
              <SectionTitle>CATEGORÍA</SectionTitle>
              <FilterSelect
                value={filters.category}
                onChange={(val) => setFilter("category", val)}
                options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
                placeholder="Todas"
              />
            </Box>

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

            <Box>
              <SectionTitle>PRECIO</SectionTitle>
              <Flex gap={2} align="center">
                <PriceInput
                  label="Mínimo"
                  value={filters.minPrice}
                  onChange={(v) => setFilter("minPrice", v)}
                  placeholder="$ 0"
                />
                <Text color="neutral.300" mt={4}>
                  —
                </Text>
                <PriceInput
                  label="Máximo"
                  value={filters.maxPrice}
                  onChange={(v) => setFilter("maxPrice", v)}
                  placeholder="$ ∞"
                />
              </Flex>
            </Box>

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

        {/* Footer Actions */}
        <Flex
          gap={2}
          px={4}
          py={4}
          borderTop="1px solid"
          borderColor="neutral.100"
          bg="white"
        >
          <Button variant="ghost" p={1} flex={1} onClick={() => clear(onClose)}>
            Limpiar
          </Button>
          <Button flex={1} p={1} onClick={() => apply(onClose)}>
            Aplicar
          </Button>
        </Flex>
      </Box>
    </>
  );
}
