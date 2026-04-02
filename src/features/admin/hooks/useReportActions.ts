import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  dismissReportAction,
  deleteReportedItemAction,
  markReportAsReviewedAction,
} from "../actions";

export function useReportActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteItem(reportId: string, targetId: string) {
    setLoading(true);
    await deleteReportedItemAction(reportId, targetId);
    setLoading(false);
    router.refresh();
  }

  async function dismissReport(reportId: string) {
    setLoading(true);
    await dismissReportAction(reportId);
    setLoading(false);
    router.refresh();
  }

  async function markAsReviewed(reportId: string) {
    setLoading(true);
    await markReportAsReviewedAction(reportId);
    setLoading(false);
    router.refresh();
  }

  return { loading, deleteItem, dismissReport, markAsReviewed };
}
