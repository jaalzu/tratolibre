// features/reports/types/index.ts

export type ReportType = "item" | "conversation" | "user";

export type ReportReason =
  | "contenido_inapropiado"
  | "spam"
  | "producto_ilegal"
  | "estafa"
  | "acoso"
  | "otro";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export interface Report {
  id: string;
  reporter_id: string;
  type: ReportType;
  target_id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  type: ReportType;
  target_id: string;
  reason: ReportReason;
  description?: string;
}

export interface CreateReportResult {
  success?: boolean;
  error?: string;
}

export interface ReportReasonOption {
  value: ReportReason;
  label: string;
}
