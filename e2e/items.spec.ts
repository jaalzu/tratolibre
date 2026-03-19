import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";
import { fillAndSubmitItem } from "./helpers/items";

test.describe("Items", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("usuario no autenticado no puede publicar", async ({ browser }) => {
    // contexto completamente nuevo sin sesión
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/item/new");
    await expect(page).toHaveURL(/login/);
    await context.close();
  });

  test("puede navegar al formulario de publicar", async ({ page }) => {
    await page.goto("/item/new");
    await expect(page).toHaveURL("/item/new");
    await expect(page.getByTestId("title")).toBeVisible();
  });

  test("muestra errores si se envía el form vacío", async ({ page }) => {
    await page.goto("/item/new");
    await page.getByTestId("submit-item").click();
    await expect(page.getByText("Mínimo 5 caracteres")).toBeVisible();
  });

  test("completa el formulario correctamente", async ({ page }) => {
    await page.goto("/item/new");
    await fillAndSubmitItem(page);
    // verificamos que los campos están llenos correctamente
    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E");
    await expect(page.getByTestId("sale_price")).toHaveValue("1000");
  });
});
