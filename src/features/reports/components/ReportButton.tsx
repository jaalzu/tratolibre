// features/reports/components/ReportButton.tsx

"use client";

import { Box } from "@chakra-ui/react";
import { ReportModal } from "./ReportModal";
import { useReportModal } from "../hooks/useReportModal";
import { ReportType } from "../types";

interface ReportButtonProps {
  type: ReportType;
  targetId: string;
  label?: string;
  color?: string;
}

export function ReportButton({
  type,
  targetId,
  label = "Reportar",
  color = "neutral.700",
}: ReportButtonProps) {
  const { isOpen, openModal, closeModal } = useReportModal({ type, targetId });

  return (
    <>
      <Box
        as="button"
        fontSize="sm"
        textDecoration="underline"
        cursor="pointer"
        color={color}
        onClick={openModal}
        _hover={{ color: "red.500" }}
        transition="color 0.2s"
      >
        {label}
      </Box>

      <ReportModal
        open={isOpen}
        onClose={closeModal}
        type={type}
        targetId={targetId}
      />
    </>
  );
}
