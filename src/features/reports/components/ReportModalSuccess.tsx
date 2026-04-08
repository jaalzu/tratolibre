// features/reports/components/ReportModalSuccess.tsx

import { Flex, Text } from "@chakra-ui/react";
import { CheckCircle } from "@boxicons/react";

export function ReportModalSuccess() {
  return (
    <Flex direction="column" align="center" gap={3} py={4}>
      <CheckCircle
        width="36px"
        height="36px"
        fill="var(--chakra-colors-brand-default)"
      />
      <Text fontWeight="semibold" color="fg">
        Reporte enviado
      </Text>
      <Text fontSize="sm" color="fg.muted" textAlign="center">
        Gracias por ayudarnos a mantener la comunidad. Lo revisaremos pronto.
      </Text>
    </Flex>
  );
}
