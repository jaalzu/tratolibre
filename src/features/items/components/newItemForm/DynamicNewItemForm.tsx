"use client";

import dynamic from "next/dynamic";
import { Box, Stack } from "@chakra-ui/react";

const FormSkeleton = () => (
  <Stack gap={4} animation="pulse 1.5s ease-in-out infinite">
    <Box h="32px" bg="neutral.100" borderRadius="md" w="1/3" mb={8} />
    {[1, 2, 3, 4].map((i) => (
      <Stack key={i} gap={2}>
        <Box h="16px" bg="neutral.100" borderRadius="md" w="20" />
        <Box h="48px" bg="neutral.50" borderRadius="lg" w="full" border="1px solid" borderColor="neutral.100" />
      </Stack>
    ))}
    <Stack gap={2}>
      <Box h="16px" bg="neutral.100" borderRadius="md" w="24" />
      <Box h="64px" bg="neutral.50" borderRadius="lg" w="full" />
    </Stack>
    <Box h="48px" bg="neutral.100" borderRadius="full" w="full" mt={10} />
  </Stack>
);

export const DynamicNewItemForm = dynamic(
  () => import("./NewItemForm").then((mod) => mod.NewItemForm),
  {
    ssr: true,
    loading: () => <FormSkeleton />,
  },
);
