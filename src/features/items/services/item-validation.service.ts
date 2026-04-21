import { ItemSchema } from "../schemas";

export function parseItemFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    sale_price: formData.get("sale_price"),
    province: formData.get("province"),
    city: formData.get("city") || undefined,
    location: formData.get("location") || undefined,
    images: formData.getAll("images") as string[],
  };
}

export function validateItemData(data: unknown) {
  return ItemSchema.safeParse(data);
}
