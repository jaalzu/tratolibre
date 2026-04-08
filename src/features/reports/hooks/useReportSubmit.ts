import { useState } from "react";
import { createReportAction } from "../actions/createReportAction";
import { ReportReason } from "../types";

interface UseReportSubmitProps {
  type: string;
  targetId: string;
  onSuccess?: () => void;
}

export function useReportSubmit({
  type,
  targetId,
  onSuccess,
}: UseReportSubmitProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setReason(null);
    setDescription("");
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!reason) return;

    setLoading(true);
    setError(null);

    const result = await createReportAction({
      type,
      target_id: targetId,
      reason,
      description,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 2000);
    }
  };

  return {
    reason,
    setReason,
    description,
    setDescription,
    loading,
    error,
    success,
    handleSubmit,
    resetForm,
  };
}
