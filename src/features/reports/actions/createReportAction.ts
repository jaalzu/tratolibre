// features/reports/actions/create-report-action.ts

"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { checkRateLimit } from "@/lib/supabase/utils/rate-limiter";
import { RateLimitError } from "@/lib/supabase/core/errors"; // Asegúrate de que la ruta sea correcta
import { ReportSchema } from "../schemas";
import { reportService } from "../services/report-service";
import { CreateReportResult } from "../types";
import { REPORT_RATE_LIMIT } from "../constants";

export async function createReportAction(
  input: unknown,
): Promise<CreateReportResult> {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return { error: "Tenés que iniciar sesión para reportar" };
    }

    // 1. Rate limit (Manejo de excepción y argumentos)
    try {
      await checkRateLimit(supabase, user.id, "create_report", {
        max: REPORT_RATE_LIMIT.MAX_REPORTS,
        windowMin: REPORT_RATE_LIMIT.TIME_WINDOW_MINUTES,
      });
    } catch (error) {
      if (error instanceof RateLimitError) {
        return { error: "Demasiados reportes. Esperá un momento." };
      }
      // Si es un error de conexión o base de datos, lo lanzamos al catch principal
      throw error;
    }

    // 2. Validación de esquema
    const parsed = ReportSchema.safeParse(input);
    if (!parsed.success) {
      return { error: "Datos inválidos" };
    }

    const { type, target_id, reason, description } = parsed.data;

    // 3. Validación: no reportarse a sí mismo (usuario)
    if (type === "user" && target_id === user.id) {
      return { error: "No podés reportarte a vos mismo" };
    }

    // 4. Validación: no reportar tu propia publicación
    if (type === "item") {
      const ownerId = await reportService.getItemOwner(supabase, target_id);

      if (ownerId === user.id) {
        return { error: "No podés reportar tu propia publicación" };
      }
    }

    // 5. Validación: no reportar conversación ajena
    if (type === "conversation") {
      const isInConversation = await reportService.isUserInConversation(
        supabase,
        target_id,
        user.id,
      );

      if (!isInConversation) {
        return { error: "No pertenecés a esta conversación" };
      }
    }

    // 6. Validación: no reportar duplicado
    const hasExisting = await reportService.hasExistingReport(
      supabase,
      user.id,
      target_id,
    );

    if (hasExisting) {
      return { error: "Ya reportaste este contenido. Estamos revisándolo." };
    }

    // 7. Crear reporte
    await reportService.createReport(supabase, user.id, {
      type,
      target_id,
      reason,
      description,
    });

    return { success: true };
  } catch (error) {
    console.error("[createReportAction] Error:", error);
    return {
      error: "Hubo un error al enviar el reporte. Intentá nuevamente.",
    };
  }
}
