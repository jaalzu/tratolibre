// features/reports/components/ReportModal.tsx

"use client";

import { Dialog, Portal } from "@chakra-ui/react";
import { ReportType } from "../types";
import { useReportSubmit } from "../hooks/useReportSubmit";
import { ReportModalContent } from "./ReportModalContent";
import { ReportModalLoading } from "./ReportModalLoading";
import { ReportModalSuccess } from "./ReportModalSuccess";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  type: ReportType;
  targetId: string;
}

export function ReportModal({
  open,
  onClose,
  type,
  targetId,
}: ReportModalProps) {
  const {
    reason,
    setReason,
    description,
    setDescription,
    loading,
    error,
    success,
    handleSubmit,
    resetForm,
  } = useReportSubmit({
    type,
    targetId,
    onSuccess: onClose,
  });

  const handleClose = () => {
    if (loading) return;
    onClose();
    resetForm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner mt={5}>
          <Dialog.Content borderRadius="2xl" p={5} maxW="420px">
            {loading ? (
              <ReportModalLoading />
            ) : success ? (
              <ReportModalSuccess />
            ) : (
              <ReportModalContent
                reason={reason}
                setReason={setReason}
                description={description}
                setDescription={setDescription}
                error={error}
                onSubmit={handleSubmit}
                onClose={handleClose}
              />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
