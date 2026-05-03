/**
 * 🔄 Mapper de Reports
 * Transforma datos entre DB y Domain
 */

import type { Report } from "../core/types";

export interface ReportDTO {
  id: string;
  reporterId: string;
  targetId: string;
  type: "item" | "user";
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface ReportWithDetailsDTO extends ReportDTO {
  reporter: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateReportInput {
  targetId: string;
  type: "item" | "user";
  reason: string;
  description?: string;
}

export const reportMapper = {
  // DB Row → DTO
  toDTO(report: Report): ReportDTO {
    return {
      id: report.id,
      reporterId: report.reporter_id,
      targetId: report.target_id,
      type: report.type as "item" | "user",
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: new Date(report.created_at!),
      resolvedAt: report.resolved_at ? new Date(report.resolved_at) : null,
      resolvedBy: report.resolved_by,
    };
  },

  // DB Row con detalles → DTO completo
  toDTOWithDetails(report: any): ReportWithDetailsDTO {
    return {
      ...this.toDTO(report),
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        avatarUrl: report.reporter.avatar_url,
      },
    };
  },

  // CreateReportInput → DB Insert
  toInsert(input: CreateReportInput, reporterId: string) {
    return {
      reporter_id: reporterId,
      target_id: input.targetId,
      type: input.type,
      reason: input.reason,
      description: input.description,
    };
  },

  toDTOArray(reports: Report[]): ReportDTO[] {
    return reports.map((r) => this.toDTO(r));
  },

  toDTOWithDetailsArray(reports: any[]): ReportWithDetailsDTO[] {
    return reports.map((r) => this.toDTOWithDetails(r));
  },
};
