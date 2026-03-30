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

    // MENSAJES ACTUALIZADOS SEGÚN TU SCHEMA
    await expect(
      page.getByText("El título debe tener al menos 5 caracteres"),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Por favor, da una descripción más detallada (mín. 15 caracteres)",
      ),
    ).toBeVisible();
  });

  test("completa el formulario correctamente", async ({ page }) => {
    await page.goto("/item/new");

    // Este helper ya lo actualizamos para que haga click en submit
    await fillAndSubmitItem(page);

    // Verificamos que los campos se llenaron (o que navegó al éxito)
    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E");
    await expect(page.getByTestId("sale_price")).toHaveValue("1.000");
  });
});
