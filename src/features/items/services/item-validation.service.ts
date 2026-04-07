// features/items/services/item-validation.service.ts

import { ItemSchema } from "../schemas";

export function parseItemFormData(formData: FormData) {
  const rawPrice = formData.get("sale_price") as string;
  const cleanPrice = rawPrice ? rawPrice.replace(/\D/g, "") : "";

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    sale_price: cleanPrice,
    province: formData.get("province"),
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    type: formData.get("type"),
    images: formData.getAll("images") as string[],
  };
}

export function validateItemData(data: unknown) {
  return ItemSchema.safeParse(data);
}
