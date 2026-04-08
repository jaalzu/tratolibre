import { useState } from "react";
import { ReportType } from "../types";

interface UseReportModalProps {
  type: ReportType;
  targetId: string;
}

export function useReportModal({ type, targetId }: UseReportModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    type,
    targetId,
  };
}
