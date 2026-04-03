"use client";

import { Box, Flex, Text, IconButton, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { X, Home } from "@boxicons/react";

interface CategoriesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CategoriesDrawer({ open, onClose }: CategoriesDrawerProps) {
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
        top={0}
        left={0}
        h="100dvh"
        w="280px"
        bg="#ffffff"
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
          borderColor="neutral.100"
        >
          <Text fontWeight="bold" fontSize="md" color="neutral.900">
            Categorías
          </Text>
          <IconButton
            variant="ghost"
            onClick={onClose}
            aria-label="cerrar"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <X width="28px" height="28px" fill="red" />
          </IconButton>
        </Flex>

        {/* Inicio */}
        <Box px={4} pt={3} pb={1}>
          <NextLink href="/" onClick={onClose}>
            <Flex
              align="center"
              gap={3}
              px={3}
              py={2.5}
              borderRadius="lg"
              _hover={{ bg: "brand.50" }}
              transition="all 0.15s"
            >
              <Home
                width="20px"
                height="20px"
                fill="var(--chakra-colors-brand-default)"
              />
              <Text fontSize="sm" color="neutral.700" fontWeight="medium">
                Inicio
              </Text>
            </Flex>
          </NextLink>
        </Box>

        {/* Divisor */}
        <Box px={4} py={1}>
          <Box borderTop="1px solid" borderColor="neutral.100" />
        </Box>

        {/* Categorías */}
        <Box overflowY="auto" flex={1} px={4} py={2}>
          <Stack gap={1}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <NextLink
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  onClick={onClose}
                >
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="lg"
                    _hover={{ bg: "brand.50" }}
                    transition="all 0.15s"
                  >
                    <Icon
                      width="20px"
                      height="20px"
                      fill="var(--chakra-colors-brand-default)"
                    />
                    <Text fontSize="sm" color="neutral.700" fontWeight="medium">
                      {cat.label}
                    </Text>
                  </Flex>
                </NextLink>
              );
            })}
          </Stack>
        </Box>

        <Box px={4} py={1}>
          <Box borderTop="1px solid" borderColor="neutral.100" />
        </Box>
      </Box>
    </>
  );
}
