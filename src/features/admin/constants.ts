export const TYPE_LABEL: Record<string, string> = {
  item: "Publicación",
  conversation: "Conversación",
  user: "Usuario",
};

export const REASON_LABEL: Record<string, string> = {
  contenido_inapropiado: "Contenido inapropiado",
  spam: "Spam o publicidad engañosa",
  producto_ilegal: "Producto falsificado o ilegal",
  estafa: "Estafa o fraude",
  acoso: "Acoso o comportamiento abusivo",
  otro: "Otro",
};

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  reviewed: "Revisado",
  dismissed: "Desestimado",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "orange.500",
  reviewed: "green.500",
  dismissed: "fg.muted",
};

export const TYPE_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "item", label: "Publicaciones" },
  { value: "user", label: "Usuarios" },
  { value: "conversation", label: "Conversaciones" },
];

export const STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "reviewed", label: "Revisados" },
  { value: "dismissed", label: "Desestimados" },
];

export const TARGET_HREF: Record<string, (id: string) => string> = {
  item: (id) => `/item/${id}`,
  user: (id) => `/profile/${id}`,
  conversation: (id) => `/admin/reports/conversation/${id}`,
};
