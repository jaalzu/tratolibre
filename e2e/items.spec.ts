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

    // ✅ Esperar a que cargue el form
    await page
      .getByTestId("title")
      .waitFor({ state: "visible", timeout: 10000 });
    await expect(page.getByTestId("title")).toBeVisible();
  });

  test("muestra errores si se envía el form vacío", async ({ page }) => {
    await page.goto("/item/new");

    // ✅ Esperar a que cargue
    await page
      .getByTestId("submit-item")
      .waitFor({ state: "visible", timeout: 10000 });
    await page.getByTestId("submit-item").click();

    // ✅ Esperar errores
    await expect(
      page.getByText("El título debe tener al menos 5 caracteres"),
    ).toBeVisible({ timeout: 5000 });

    await expect(
      page.getByText(
        "Por favor, da una descripción más detallada (mín. 15 caracteres)",
      ),
    ).toBeVisible({ timeout: 5000 });
  });

  test("completa el formulario correctamente", async ({ page }) => {
    await page.goto("/item/new");

    // ✅ Esperar form
    await page
      .getByTestId("title")
      .waitFor({ state: "visible", timeout: 10000 });

    await fillAndSubmitItem(page);

    // ✅ Verificar valores con timeout
    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E", {
      timeout: 5000,
    });
    await expect(page.getByTestId("sale_price")).toHaveValue("1.000", {
      timeout: 5000,
    });
  });
});
