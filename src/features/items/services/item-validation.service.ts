// features/items/services/item-validation.service.ts

export function parseItemFormData(formData: FormData) {
  const parseJSON = (value: FormDataEntryValue | null): any => {
    if (!value || value === "null" || value === "undefined") return undefined;
    try {
      return JSON.parse(value as string);
    } catch {
      return undefined;
    }
  };

  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    salePrice: formData.get("salePrice")
      ? Number(formData.get("salePrice"))
      : undefined,
    province: formData.get("province") as string | undefined,
    city: formData.get("city") as string | undefined,
    condition: formData.get("condition") as string | undefined,
    type: formData.get("type") as string | undefined,
    images: parseJSON(formData.get("images")),
    rules: formData.get("rules") as string | undefined,
    location: formData.get("location") as string | undefined,
  };
}
