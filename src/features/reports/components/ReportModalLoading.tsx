// features/reports/components/ReportModalLoading.tsx

import { Flex, Text, Spinner } from "@chakra-ui/react";

export function ReportModalLoading() {
  return (
    <Flex align="center" gap={3} py={2}>
      <Spinner size="sm" color="brand.default" />
      <Text fontSize="sm" fontWeight="medium">
        Enviando reporte...
      </Text>
    </Flex>
  );
}
