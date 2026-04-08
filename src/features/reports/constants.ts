import { ReportReasonOption } from "./types";

export const REPORT_REASONS: ReportReasonOption[] = [
  { value: "contenido_inapropiado", label: "Contenido inapropiado u ofensivo" },
  { value: "spam", label: "Spam o publicidad engañosa" },
  { value: "producto_ilegal", label: "Producto falsificado o ilegal" },
  { value: "estafa", label: "Estafa o fraude" },
  { value: "acoso", label: "Acoso o comportamiento abusivo" },
  { value: "otro", label: "Otro" },
] as const;

export const REPORT_RATE_LIMIT = {
  MAX_REPORTS: 10,
  TIME_WINDOW_MINUTES: 60,
} as const;
