import { Flex, Text, Stack } from "@chakra-ui/react";
import { ReportCard } from "./ReportCard";
import { AdminReport } from "../../types";
import { CheckCircle } from "@boxicons/react";

interface ReportsListProps {
  reports: AdminReport[];
}

export function ReportsList({ reports }: ReportsListProps) {
  if (reports.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py={16} gap={2}>
        <CheckCircle
          width="32px"
          height="32px"
          fill="var(--chakra-colors-fg-muted)"
        />
        <Text fontSize="sm" color="fg.muted">
          No hay reportes para estos filtros.
        </Text>
      </Flex>
    );
  }

  return (
    <Stack gap={3}>
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </Stack>
  );
}
