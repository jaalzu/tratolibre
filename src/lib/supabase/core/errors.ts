/**
 * 🚨 Manejo centralizado de errores de Supabase
 * Mapea códigos PostgreSQL a mensajes amigables en español
 */

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class NotFoundError extends DatabaseError {
  constructor(entity: string, id: string) {
    super(`${entity} con id ${id} no encontrado`, "NOT_FOUND");
  }
}

export class UnauthorizedError extends DatabaseError {
  constructor(message = "No tenés permisos para realizar esta acción") {
    super(message, "UNAUTHORIZED");
  }
}

export class RateLimitError extends DatabaseError {
  constructor(action: string) {
    super(`Has superado el límite de intentos para: ${action}`, "RATE_LIMIT");
  }
}

const FIELD_TRANSLATIONS: Record<string, string> = {
  city: "ciudad",
  title: "título",
  description: "descripción",
  price: "precio",
  sale_price: "precio de venta",
  province: "provincia",
  category: "categoría",
  condition: "condición",
  type: "tipo de publicación",
  owner_id: "propietario",
  user_id: "usuario",
  item_id: "publicación",
  name: "nombre",
  email: "email",
  password: "contraseña",
};

/**
 * Mapea errores de Supabase/Postgres a mensajes amigables
 */
export function mapSupabaseError(error: any): string {
  if (process.env.NODE_ENV === "development") {
    console.error("Supabase error:", error);
  }

  // NOT NULL constraint (23502)
  if (error.code === "23502") {
    const field = error.message.match(/column "(\w+)"/)?.[1];
    return `El campo "${FIELD_TRANSLATIONS[field] || field}" es requerido.`;
  }

  // Unique constraint (23505)
  if (error.code === "23505") {
    return error.message.includes("email")
      ? "Este email ya está registrado."
      : "Ya existe un registro con esos datos.";
  }

  // Foreign key violation (23503)
  if (error.code === "23503") {
    return "Referencia inválida. El elemento relacionado no existe.";
  }

  // Check constraint (23514)
  if (error.code === "23514") {
    return "Los datos no cumplen con las reglas de validación.";
  }

  // Permission denied
  if (
    error.code === "42501" ||
    error.code === "PGRST301" ||
    error.code === "PGRST116"
  ) {
    return "No tenés permisos para realizar esta acción.";
  }

  // Network errors
  if (
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("NetworkError")
  ) {
    return "Error de conexión. Verificá tu internet e intentá de nuevo.";
  }

  // Auth errors
  if (error.message?.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (error.message?.includes("Email not confirmed")) {
    return "Confirmá tu email antes de iniciar sesión.";
  }
  if (error.message?.includes("User already registered")) {
    return "Este email ya está registrado.";
  }

  // Storage errors
  if (error.message?.includes("Payload too large")) {
    return "El archivo es demasiado grande. Máximo 5MB.";
  }

  return "Ocurrió un error inesperado. Intentá de nuevo.";
}
