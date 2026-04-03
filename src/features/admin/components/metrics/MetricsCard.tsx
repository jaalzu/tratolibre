"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Group, Package, TrendingUp, Flag } from "@boxicons/react";

// Creamos un mapa para traducir el string al componente real
const ICONS = {
  group: Group,
  package: Package,
  "trending-up": TrendingUp,
  flag: Flag,
};

interface MetricCardProps {
  title: string;
  iconName: keyof typeof ICONS; // Solo acepta las llaves del mapa de arriba
  primary: { label: string; value: string | number };
  secondary?: { label: string; value: string | number };
  alert?: boolean;
}

export function MetricCard({
  title,
  iconName,
  primary,
  secondary,
  alert,
}: MetricCardProps) {
  // Obtenemos el componente según el nombre que llegó por props
  const Icon = ICONS[iconName];

  return (
    <Box bg="neutral.50" borderRadius="2xl" px={6} py={5}>
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Text fontSize="md" fontWeight="semibold" color="accent.default">
          {title}
        </Text>
        <Flex
          w={10}
          h={10}
          bg="brand.hover"
          borderRadius="lg"
          align="center"
          justify="center"
          flexShrink={0}
        >
          {Icon && (
            <Icon
              width="18px"
              height="18px"
              fill="var(--chakra-colors-brand-100)"
            />
          )}
        </Flex>
      </Flex>

      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={alert ? "secondary.default" : "neutral.700"}
        lineHeight="1"
      >
        {primary.value}
      </Text>
      <Text fontSize="xs" color="neutral.500" mt={1}>
        {primary.label}
      </Text>

      {secondary && (
        <Flex
          align="center"
          gap={1}
          mt={3}
          pt={3}
          borderTop="2px solid"
          borderColor="border.subtle"
        >
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">
            {secondary.value}
          </Text>
          <Text fontSize="xs" color="neutral.600">
            {secondary.label}
          </Text>
        </Flex>
      )}
    </Box>
  );
}
