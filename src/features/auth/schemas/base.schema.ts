// features/auth/schemas/base.schema.ts

/**
 * Tipos base para Discriminated Unions en Actions/Services
 */
export type ActionSuccess<T = void> = {
  success: true;
  data: T;
};

export type ActionError = {
  success: false;
  error: string;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

/**
 * Helpers para crear respuestas de forma más limpia
 */
export const ok = <T = void>(data?: T): ActionSuccess<T> => ({
  success: true,
  data: data as T,
});

export const err = (error: string): ActionError => ({
  success: false,
  error,
});
