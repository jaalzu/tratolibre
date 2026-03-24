import { z } from "zod";

export const ItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(80, "El título no puede superar los 80 caracteres"),
  description: z
    .string()
    .trim()
    .min(20, "Por favor, da una descripción más detallada (mín. 20 caracteres)")
    .max(1000, "La descripción es muy larga (máx. 1000 caracteres)"),
  category: z.string().min(1, "Elegí una categoría"),
  condition: z.string().min(1, "Seleccioná el estado del producto"),
  sale_price: z.coerce
    .number()
    .min(1, "El precio mínimo es $1")
    .max(10000000, "El precio es demasiado alto"), // Límite de seguridad
  province: z.string().min(1, "Elegí una provincia"),
  city: z.string().optional(),
  location: z.string().optional(),
  images: z
    .array(z.string())
    .min(1, "Subí al menos una foto para vender más rápido")
    .max(4, "Máximo 4 fotos"),
});

export type ItemInput = z.infer<typeof ItemSchema>;
