import { z } from "zod";

const cleanMoney = (val: unknown) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/\D/g, "");
    return cleaned === "" ? undefined : cleaned;
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
    .min(15, "Da una descripción más detallada (mín. 15 caracteres)")
    .max(800, "La descripción es muy larga (máx. 800 caracteres)"),

  category: z.string().min(1, "Elegí una categoría"),

  condition: z.string().min(1, "Seleccioná el estado del producto"),

  sale_price: z
    .preprocess((val) => {
      if (typeof val !== "string") return val;
      const cleaned = val.replace(/\D/g, "");
      // Si está vacío, devolvemos un valor que falle la validación de abajo
      return cleaned === "" ? 0 : Number(cleaned);
    }, z.number())
    // Aquí es donde controlamos el mensaje de error de forma manual
    .refine((n) => n > 0, {
      message: "El precio es obligatorio",
    })
    .refine((n) => n <= 200000000, {
      message: "El precio es demasiado alto",
    }),

  province: z.string().min(1, "Elegí una provincia"),

  city: z.string().optional(),

  location: z.string().optional(),

  images: z
    .array(z.string())
    .min(1, "Subí al menos una foto para vender más rápido")
    .max(4, "Máximo 4 fotos"),
});

export type ItemFormInput = z.input<typeof ItemSchema>;
export type ItemFormOutput = z.output<typeof ItemSchema>;
