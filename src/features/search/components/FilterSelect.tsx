"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ChevronUp, ChevronDown, Check } from "@boxicons/react";
import { useFilterSelect } from "../hooks/useFilterSelect";

interface Option {
  id: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: FilterSelectProps) {
  const { open, ref, selected, toggle, close } = useFilterSelect(
    value,
    options,
  );

  return (
    <Box position="relative" ref={ref}>
      <Flex
        as="button"
        w="full"
        align="center"
        justify="space-between"
        px={3}
        h="38px"
        border="1px solid"
        borderColor={open ? "brand.default" : "neutral.200"}
        borderRadius="lg"
        bg="transparent"
        cursor="pointer"
        onClick={toggle}
        transition="border-color 0.15s"
      >
        <Text
          fontSize="sm"
          color="neutral.700"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          flex={1}
          textAlign="left"
        >
          {selected ? selected.label : placeholder}
        </Text>
        {open ? (
          <ChevronUp
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-400)"
          />
        ) : (
          <ChevronDown
            width="18px"
            height="18px"
            fill="var(--chakra-colors-neutral-400)"
          />
        )}
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="white" // Cambiado a white para que destaque sobre el panel
          border="1px solid"
          borderColor="neutral.200"
          borderRadius="lg"
          boxShadow="lg"
          zIndex={100} // Aumentado para que no lo tape nada
          maxH="220px"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "100px",
              background: "#c1c1c1",
            },
          }}
        >
          {/* Opción para limpiar/deseleccionar */}
          <Box
            as="button"
            w="full"
            textAlign="left"
            px={3}
            py={2}
            _hover={{ bg: "neutral.50" }}
            onClick={() => {
              onChange("");
              close();
            }}
          >
            <Text fontSize="sm" color="neutral.400">
              {placeholder}
            </Text>
          </Box>

          {/* Listado de Opciones */}
          {options.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <Box
                key={opt.id}
                as="button"
                w="full"
                textAlign="left"
                px={3}
                py={2}
                bg={isSelected ? "brand.50" : "transparent"}
                _hover={{ bg: isSelected ? "brand.50" : "neutral.50" }}
                onClick={() => {
                  onChange(opt.id);
                  close();
                }}
              >
                <Flex align="center" justify="space-between">
                  <Text
                    fontSize="sm"
                    color={isSelected ? "brand.default" : "neutral.700"}
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Check
                      width="16px"
                      height="16px"
                      fill="var(--chakra-colors-brand-default)"
                    />
                  )}
                </Flex>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
