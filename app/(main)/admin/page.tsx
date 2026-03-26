// app/(main)/admin/page.tsx
import dynamic from "next/dynamic";
import { getAdminMetrics } from "@/features/admin/actions";
import { Skeleton, SimpleGrid, Box } from "@chakra-ui/react";

// Cargamos el componente visual de forma dinámica
const AdminMetrics = dynamic(
  () =>
    import("@/features/admin/components/metrics/AdminMetrics").then(
      (mod) => mod.AdminMetrics,
    ),
  {
    loading: () => (
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} h="120px" borderRadius="xl" />
        ))}
      </SimpleGrid>
    ),
  },
);

export default async function AdminPage() {
  const metrics = await getAdminMetrics();

  return <AdminMetrics metrics={metrics} />;
}
