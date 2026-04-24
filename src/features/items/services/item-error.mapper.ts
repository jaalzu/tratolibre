import { PostgrestError } from "@supabase/supabase-js";
import { ItemError } from "../types";

/**
 * Mapea errores de Supabase a ItemError tipado
 */
export function mapSupabaseToItemError(
  error: PostgrestError | Error | unknown,
  context: string,
): ItemError {
  // Error de Postgres/Supabase
  if (error && typeof error === "object" && "code" in error) {
    const pgError = error as PostgrestError;

    switch (pgError.code) {
      // Unauthorized / Permission denied
      case "42501":
      case "PGRST301":
        return {
          type: "unauthorized",
          message: "No tienes permiso para realizar esta operación",
        };

      // Not found / No rows returned
      case "PGRST116":
        return {
          type: "not_found",
          message: "El item no fue encontrado",
        };

      // Foreign key violation
      case "23503":
        return {
          type: "database",
          message: "No se puede eliminar porque tiene datos relacionados",
          code: pgError.code,
        };

      // Unique constraint violation
      case "23505":
        return {
          type: "database",
          message: "Ya existe un registro con estos datos",
          code: pgError.code,
        };

      default:
        return {
          type: "database",
          message: pgError.message || `Error de base de datos en ${context}`,
          code: pgError.code,
        };
    }
  }

  // Error estándar de JavaScript
  if (error instanceof Error) {
    return {
      type: "unknown",
      message: error.message || `Error inesperado en ${context}`,
    };
  }

  // Error desconocido
  return {
    type: "unknown",
    message: `Error inesperado en ${context}`,
  };
}

/**
 * Convierte ItemError a un mensaje amigable para el usuario
 */
export function itemErrorToMessage(error: ItemError): string {
  switch (error.type) {
    case "unauthorized":
      return error.message;
    case "not_found":
      return "El item que buscás no existe o fue eliminado";
    case "validation":
      return error.message;
    case "rate_limit":
      return error.message;
    case "database":
      return "Hubo un problema con la base de datos. Intentá nuevamente";
    case "unknown":
      return "Ocurrió un error inesperado. Por favor, intentá más tarde";
  }
}
