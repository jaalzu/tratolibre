import { describe, it, expect } from "vitest";
import { ItemSchema } from "@/features/items/schemas";

describe("ItemSchema", () => {
  const validItem = {
    title: "PlayStation 5 usado",
    description:
      "Consola en perfecto estado, con dos controles y todos los cables.",
    category: "juegos",
    condition: "good" as const,
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
    expect(result.error?.issues[0].message).toBe("Mínimo 5 caracteres");
  });

  it("rechaza descripción menor a 20 caracteres", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      description: "Muy corta",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Describilo bien");
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

  it("rechaza condition inválida", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      condition: "destroyed",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza sin imágenes", () => {
    const result = ItemSchema.safeParse({ ...validItem, images: [] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Al menos 1 foto");
  });

  it("rechaza más de 4 imágenes", () => {
    const result = ItemSchema.safeParse({
      ...validItem,
      images: ["a", "b", "c", "d", "e"],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Máximo 4 fotos");
  });

  it("acepta item sin ciudad (opcional)", () => {
    const { city, ...itemSinCiudad } = validItem;
    const result = ItemSchema.safeParse(itemSinCiudad);
    expect(result.success).toBe(true);
  });
});
