"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import "boxicons/css/boxicons.min.css";

const SORT_OPTIONS = [
  { id: "closest", label: "Más recientes" },
  { id: "most_relevance", label: "Más relevantes" },
  { id: "price_asc", label: "Menor precio" },
  { id: "price_desc", label: "Mayor precio" },
];

interface SortModalProps {
  open: boolean;
  onClose: () => void;
}

export function SortModal({ open, onClose }: SortModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("order_by") ?? "closest";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order_by", id);
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  return (
    <>
      {open && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.400"
          zIndex={200}
          onClick={onClose}
        />
      )}

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
            <i
              className="bx bx-x "
              aria-label="close button"
              style={{ fontSize: "28px", color: "red" }}
            />
          </Box>
        </Flex>

        <Box py={2}>
          {SORT_OPTIONS.map((opt) => (
            <Flex
              key={opt.id}
              as="button"
              w="full"
              align="center"
              justify="space-between"
              px={4}
              py={3}
              onClick={() => handleSelect(opt.id)}
              _hover={{ bg: "neutral.50" }}
              transition="background 0.15s"
            >
              <Text
                fontSize="md"
                color={current === opt.id ? "brand.default" : "neutral.700"}
                fontWeight={current === opt.id ? "bold" : "normal"}
              >
                {opt.label}
              </Text>
              {current === opt.id && (
                <i
                  className="bx bx-check"
                  aria-label="selected order"
                  style={{
                    fontSize: "24px",
                    color: "var(--chakra-colors-brand-default)",
                  }}
                />
              )}
            </Flex>
          ))}
        </Box>
      </Box>
    </>
  );
}
