/**
 * Mapea errores de Supabase/Postgres a mensajes amigables para el usuario
 */
export function mapSupabaseError(error: any): string {
  // Log para debugging en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.error("Supabase error:", error);
  }

  // NOT NULL constraint violation (23502)
  if (error.code === "23502") {
    const field = error.message.match(/column "(\w+)"/)?.[1];
    const fieldMap: Record<string, string> = {
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
    return `El campo "${fieldMap[field] || field}" es requerido.`;
  }

  // Unique constraint violation (23505)
  if (error.code === "23505") {
    if (error.message.includes("email")) {
      return "Este email ya está registrado.";
    }
    return "Ya existe un registro con esos datos.";
  }

  // Foreign key violation (23503)
  if (error.code === "23503") {
    return "Referencia inválida. El elemento relacionado no existe.";
  }

  // Check constraint violation (23514)
  if (error.code === "23514") {
    return "Los datos no cumplen con las reglas de validación.";
  }

  // Permission denied (42501)
  if (error.code === "42501" || error.code === "PGRST301") {
    return "No tenés permisos para realizar esta acción.";
  }

  // Row level security policy violation (PGRST116)
  if (error.code === "PGRST116") {
    return "No tenés permisos para acceder a este recurso.";
  }

  // Network/connection errors
  if (
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("NetworkError")
  ) {
    return "Error de conexión. Por favor verificá tu internet e intentá de nuevo.";
  }

  // Auth errors
  if (error.message?.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }

  if (error.message?.includes("Email not confirmed")) {
    return "Por favor confirmá tu email antes de iniciar sesión.";
  }

  if (error.message?.includes("User already registered")) {
    return "Este email ya está registrado.";
  }

  // Storage errors
  if (error.message?.includes("Bucket not found")) {
    return "Error al subir archivo. Por favor intentá de nuevo.";
  }

  if (error.message?.includes("Payload too large")) {
    return "El archivo es demasiado grande. El tamaño máximo es 5MB.";
  }

  // Generic fallback
  return "Ocurrió un error inesperado. Por favor intentá de nuevo.";
}
