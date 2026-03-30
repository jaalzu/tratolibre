import { z } from "zod";

const clearMoneyString = (val: any) => {
  if (typeof val === "string") {
    return val.replace(/\D/g, "");
  }
  return val;
};

export const ItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(60, "El título no puede superar los 60 caracteres"),
  description: z
    .string()
    .trim()
    .min(15, "Por favor, da una descripción más detallada (mín. 15 caracteres)")
    .max(800, "La descripción es muy larga (máx. 800 caracteres)"),
  category: z.string().min(1, "Elegí una categoría"),
  condition: z.string().min(1, "Seleccioná el estado del producto"),

  sale_price: z.preprocess(
    clearMoneyString,
    z.coerce
      .number()
      .min(1, "El precio mínimo es $1")
      .max(200000000, "El precio es demasiado alto"),
  ),

  province: z.string().min(1, "Elegí una provincia"),
  city: z.string().optional(),
  location: z.string().optional(),
  images: z
    .array(z.string())
    .min(1, "Subí al menos una foto para vender más rápido")
    .max(4, "Máximo 4 fotos"),
});

export type ItemInput = z.infer<typeof ItemSchema>;
