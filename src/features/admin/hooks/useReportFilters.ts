import { useState } from "react";
import { AdminReport } from "../types";

export function useReportFilters(reports: AdminReport[]) {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("pending");

  const filtered = reports.filter((r) => {
    const matchType = type === "all" || r.type === type;
    const matchStatus = status === "all" || r.status === status;
    return matchType && matchStatus;
  });

  return { type, setType, status, setStatus, filtered };
}
