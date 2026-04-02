export interface AdminReport {
  id: string;
  type: "item" | "conversation" | "user";
  target_id: string;
  reason: string;
  description?: string;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  reporter: {
    id: string;
    name: string;
    avatar_url?: string;
  } | null;
}

export interface AdminMetricsData {
  totalUsers: number;
  newUsers: number;
  totalItems: number;
  newItems: number;
  pendingReports: number;
  totalSales: number;
  totalSalesValue: number;
}
