"use client";

import { Box, Text } from "@chakra-ui/react";
import { EmptyState } from "@/components/ui/EmptyState";
import NextLink from "next/link";
import { AlertCircle } from "@boxicons/react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Box minH="100dvh" position="relative">
      <Box position="absolute" top={6} left={6}>
        <NextLink href="/">
          <Text fontSize="xl" fontWeight="bold" color="neutral.900">
            TratoLibre
          </Text>
        </NextLink>
      </Box>

      <EmptyState
        icon={
          <AlertCircle
            width="64px"
            height="64px"
            fill="var(--chakra-colors-feedback-error)"
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
