"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { X, Check } from "@boxicons/react";
import { useSortNavigation } from "../hooks/useSortNavigation";
import { SORT_OPTIONS } from "../constants";

interface SortModalProps {
  open: boolean;
  onClose: () => void;
}

export function SortModal({ open, onClose }: SortModalProps) {
  const { currentOrder, handleSortChange } = useSortNavigation();

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

      {/* Sheet / Modal */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="neutral.50"
        borderTopRadius="2xl"
        zIndex={201}
        transform={open ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.25s ease"
        pb="env(safe-area-inset-bottom)"
      >
        <Flex
          px={4}
          pt={4}
          pb={3}
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="neutral.100"
        >
          <Text fontWeight="bold" fontSize="lg" color="neutral.900">
            Ordenar por
          </Text>
          <Box as="button" onClick={onClose} color="neutral.400">
            <X width="28px" height="28px" fill="currentColor" />
          </Box>
        </Flex>

        <Box py={2}>
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentOrder === opt.id;

            return (
              <Flex
                key={opt.id}
                as="button"
                w="full"
                align="center"
                justify="space-between"
                px={4}
                py={3}
                onClick={() => handleSortChange(opt.id, onClose)}
                _hover={{ bg: "neutral.100" }}
                transition="background 0.15s"
              >
                <Text
                  fontSize="md"
                  color={isSelected ? "brand.default" : "neutral.700"}
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <Check
                    width="24px"
                    height="24px"
                    fill="var(--chakra-colors-brand-default)"
                  />
                )}
              </Flex>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
