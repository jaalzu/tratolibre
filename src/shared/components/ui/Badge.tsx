import { Box } from "@chakra-ui/react";

const variants: Record<string, { bg: string; color: string }> = {
  pending: { bg: "secondary.default", color: "fg.inverted" },
  accepted: { bg: "brand.subtle", color: "brand.hover" },
  rejected: { bg: "feedback.error", color: "fg.inverted" },
  active: { bg: "accent.subtle", color: "accent.hover" },
  completed: { bg: "neutral.50", color: "fg.muted" },
  cancelled: { bg: "feedback.error", color: "fg.inverted" },
};

const labels: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  active: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
};

export function StatusBadge({ status }: { status: string }) {
  const s = variants[status] ?? { bg: "neutral.100", color: "fg.muted" };
  return (
    <Box
      as="span"
      bg={s.bg}
      color={s.color}
      fontSize="xs"
      fontWeight="bold"
      px={2}
      py={1}
      borderRadius="sm"
    >
      {labels[status] ?? status}
    </Box>
  );
}
