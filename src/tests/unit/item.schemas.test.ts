import { describe, it, expect } from "vitest";
import { ItemSchema } from "@/features/items/schemas";

describe("ItemSchema", () => {
  const validItem = {
    title: "PlayStation 5 usado",
    description:
      "Consola en perfecto estado, con dos controles y todos los cables.",
    category: "juegos",
    condition: "good",
    sale_price: 150000,
    province: "Buenos Aires",
    city: "CABA",
    images: ["https://example.com/image.jpg"],
  };

  it("acepta un item válido", () => {
    const result = ItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it("rechaza título menor a 5 caracteres", () => {
    const result = ItemSchema.safeParse({ ...validItem, title: "PS5" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "El título debe tener al menos 5 caracteres",
    );
  });

  it("rechaza descripción menor a 15 caracteres", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      description: "Muy corta", // Esto tiene 9 caracteres, debería fallar
    });
    expect(result.success).toBe(false);
    // AJUSTADO A 15 CARACTERES:
    expect(result.error?.issues[0].message).toBe(
      "Por favor, da una descripción más detallada (mín. 15 caracteres)",
    );
  });

  it("rechaza precio 0", () => {
    const result = ItemSchema.safeParse({ ...validItem, sale_price: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("El precio mínimo es $1");
  });

  it("rechaza precio negativo", () => {
    const result = ItemSchema.safeParse({ ...validItem, sale_price: -100 });
    expect(result.success).toBe(false);
  });

  it("rechaza si no se selecciona estado", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      condition: "",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza sin imágenes", () => {
    const result = ItemSchema.safeParse({ ...validItem, images: [] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Subí al menos una foto para vender más rápido",
    );
  });

  it("rechaza más de 4 imágenes", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      images: ["a", "b", "c", "d", "e"],
    });
    expect(result.success).toBe(false);
  });

  it("acepta item sin ciudad (opcional)", () => {
    const { city, ...itemSinCiudad } = validItem;
    const result = ItemSchema.safeParse(itemSinCiudad);
    expect(result.success).toBe(true);
  });
});
