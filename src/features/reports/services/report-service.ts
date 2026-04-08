import { SupabaseClient } from "@supabase/supabase-js";
import { CreateReportInput, Report } from "../types";

export const reportService = {
  /**
   * Crea un nuevo reporte
   */
  async createReport(
    supabase: SupabaseClient,
    reporterId: string,
    input: CreateReportInput,
  ): Promise<Report | null> {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporterId,
        type: input.type,
        target_id: input.target_id,
        reason: input.reason,
        description: input.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Verifica si existe un reporte pendiente del usuario al target
   */
  async hasExistingReport(
    supabase: SupabaseClient,
    reporterId: string,
    targetId: string,
  ): Promise<boolean> {
    const { data } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", reporterId)
      .eq("target_id", targetId)
      .eq("status", "pending")
      .single();

    return !!data;
  },

  /**
   * Obtiene el owner de un item
   */
  async getItemOwner(
    supabase: SupabaseClient,
    itemId: string,
  ): Promise<string | null> {
    const { data } = await supabase
      .from("items")
      .select("profile_id")
      .eq("id", itemId)
      .single();

    return data?.profile_id || null;
  },

  /**
   * Verifica si el usuario pertenece a la conversación
   */
  async isUserInConversation(
    supabase: SupabaseClient,
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const { data } = await supabase
      .from("conversations")
      .select("buyer_id, seller_id")
      .eq("id", conversationId)
      .single();

    if (!data) return false;
    return data.buyer_id === userId || data.seller_id === userId;
  },
};
