/**
 * 🎯 Service de Reports
 * Lógica de negocio para reportes/denuncias
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { ReportsRepository } from "../repositories/reports";
import {
  reportMapper,
  type ReportDTO,
  type ReportWithDetailsDTO,
  type CreateReportInput,
} from "../mappers/report";
import { checkRateLimit, RATE_LIMITS } from "../utils/rate-limiter";
import {
  UnauthorizedError,
  NotFoundError,
  DatabaseError,
} from "../core/errors";

export class ReportsService {
  private repository: ReportsRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ReportsRepository(supabase);
  }

  /**
   * Obtener reportes pendientes (solo admin)
   */
  async getPending(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ReportWithDetailsDTO[]> {
    const reports = await this.repository.findPending(options);
    return reportMapper.toDTOWithDetailsArray(reports);
  }

  /**
   * Obtener reportes de un target específico
   */
  async getByTarget(targetId: string): Promise<ReportWithDetailsDTO[]> {
    const reports = await this.repository.findByTarget(targetId);
    return reportMapper.toDTOWithDetailsArray(reports);
  }

  /**
   * Obtener reportes hechos por un usuario
   */
  async getByReporter(
    reporterId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ReportDTO[]> {
    const reports = await this.repository.findByReporter(reporterId, options);
    return reportMapper.toDTOArray(reports);
  }

  /**
   * Crear reporte
   */
  async create(
    input: CreateReportInput,
    reporterId: string,
  ): Promise<ReportDTO> {
    // Rate limiting
    await checkRateLimit(
      this.supabase,
      reporterId,
      "create_report",
      RATE_LIMITS.CREATE_REPORT,
    );

    // No puede reportarse a sí mismo
    if (input.targetId === reporterId) {
      throw new UnauthorizedError("No podés reportarte a vos mismo");
    }

    // Verificar que no haya reportado ya este target
    const hasReported = await this.repository.hasReported(
      reporterId,
      input.targetId,
    );
    if (hasReported) {
      throw new DatabaseError("Ya reportaste este contenido/usuario");
    }

    const insertData = reportMapper.toInsert(input, reporterId);
    const created = await this.repository.create(insertData);
    return reportMapper.toDTO(created);
  }

  /**
   * Resolver reporte (marcar como resuelto) - Solo admin
   */
  async resolve(reportId: string, adminId: string): Promise<ReportDTO> {
    const report = await this.repository.findById(reportId);
    if (!report) throw new NotFoundError("Report", reportId);

    if (report.status !== "pending") {
      throw new DatabaseError("Este reporte ya fue procesado");
    }

    const updated = await this.repository.resolve(reportId, adminId);
    return reportMapper.toDTO(updated);
  }

  /**
   * Rechazar reporte - Solo admin
   */
  async reject(reportId: string, adminId: string): Promise<ReportDTO> {
    const report = await this.repository.findById(reportId);
    if (!report) throw new NotFoundError("Report", reportId);

    if (report.status !== "pending") {
      throw new DatabaseError("Este reporte ya fue procesado");
    }

    const updated = await this.repository.reject(reportId, adminId);
    return reportMapper.toDTO(updated);
  }

  /**
   * Obtener estadísticas de reportes - Solo admin
   */
  async getStats() {
    return this.repository.getStats();
  }

  /**
   * Contar reportes pendientes por tipo - Solo admin
   */
  async countPendingByType(type: "item" | "user"): Promise<number> {
    return this.repository.countByType(type);
  }

  /**
   * Eliminar reporte (solo quien lo creó)
   */
  async delete(reportId: string, userId: string): Promise<void> {
    const report = await this.repository.findById(reportId);
    if (!report) throw new NotFoundError("Report", reportId);

    if (report.reporter_id !== userId) {
      throw new UnauthorizedError("Solo podés eliminar tus propios reportes");
    }

    // Solo se pueden eliminar reportes pendientes
    if (report.status !== "pending") {
      throw new DatabaseError("No podés eliminar un reporte ya procesado");
    }

    await this.repository.delete(reportId);
  }

  /**
   * Verificar si un contenido tiene muchos reportes (flag para revisión urgente)
   */
  async checkIfNeedsUrgentReview(
    targetId: string,
  ): Promise<{ urgent: boolean; count: number }> {
    const reports = await this.repository.findByTarget(targetId);
    const pendingCount = reports.filter((r) => r.status === "pending").length;

    return {
      urgent: pendingCount >= 3, // 3+ reportes = urgente
      count: pendingCount,
    };
  }
}
