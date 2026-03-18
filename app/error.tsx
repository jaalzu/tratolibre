"use client";

import { Box, Text } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/EmptyState";
import NextLink from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Box minH="100vh" position="relative">
      <Box position="absolute" top={6} left={6}>
        <NextLink href="/">
          <Text fontSize="xl" fontWeight="bold" color="neutral.900">
            TratoLibre
          </Text>
        </NextLink>
      </Box>

      <EmptyState
        icon={
          <i
            className="bx bx-error-circle"
            style={{
              fontSize: "64px",
              color: "var(--chakra-colors-feedback-error)",
            }}
          />
        }
        title="Algo salió mal"
        description="Ocurrió un error inesperado."
        actionLabel="Volver al inicio"
        actionHref="/"
      />
    </Box>
  );
}
