import { SimpleGrid } from "@chakra-ui/react";
import { AdminMetricsData } from "../../types";
import { MetricCard } from "./MetricsCard";

export function AdminMetrics({ metrics }: { metrics: AdminMetricsData }) {
  const salesValueFormatted = metrics.totalSalesValue.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
      <MetricCard
        title="Usuarios"
        icon="bx-group"
        primary={{ value: metrics.totalUsers, label: "usuarios registrados" }}
        secondary={{
          value: `+${metrics.newUsers}`,
          label: "nuevos esta semana",
        }}
      />
      <MetricCard
        title="Publicaciones"
        icon="bx-package"
        primary={{ value: metrics.totalItems, label: "publicaciones activas" }}
        secondary={{
          value: `+${metrics.newItems}`,
          label: "nuevas esta semana",
        }}
      />
      <MetricCard
        title="Ventas"
        icon="bx-trending-up"
        primary={{ value: metrics.totalSales, label: "ventas concretadas" }}
        secondary={{ value: salesValueFormatted, label: "en valor total" }}
      />
      <MetricCard
        title="Reportes"
        icon="bx-flag"
        primary={{
          value: metrics.pendingReports,
          label: "reportes pendientes",
        }}
        alert={metrics.pendingReports > 0}
      />
    </SimpleGrid>
  );
}
