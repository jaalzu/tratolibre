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
    await page.waitForLoadState("networkidle");

    const submitButton = page.getByTestId("submit-item");
    await submitButton.waitFor({ state: "visible", timeout: 10000 });

    await submitButton.click();

    // ✅ Verificar que hay campos con error
    const invalidFields = page.locator("[data-invalid]");
    await expect(invalidFields.first()).toBeVisible({ timeout: 5000 });

    // ✅ Contar que hay al menos 2 errores (título y descripción)
    const errorCount = await page.locator('[data-part="error-text"]').count();
    expect(errorCount).toBeGreaterThanOrEqual(2);

    // ✅ Verificar textos específicos
    await expect(
      page.getByText("El título debe tener al menos 5 caracteres"),
    ).toBeVisible();
    await expect(page.getByText(/descripción más detallada/i)).toBeVisible();
  });

  test("completa el formulario correctamente", async ({ page }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    await page
      .getByTestId("title")
      .waitFor({ state: "visible", timeout: 10000 });

    // ✅ Llenar SIN submit
    await fillAndSubmitItem(page, { submit: false });

    // ✅ Verificar valores
    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E");
    await expect(page.getByTestId("sale_price")).toHaveValue("1.000");
  });

  test("DEBUG: muestra errores si se envía el form vacío", async ({ page }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    // ✅ Esperar que el form esté listo
    const submitButton = page.getByTestId("submit-item");
    await submitButton.waitFor({ state: "visible", timeout: 10000 });

    // ✅ Screenshot ANTES de hacer click
    await page.screenshot({ path: "test-results/before-submit.png" });

    // ✅ Click en submit
    await submitButton.click();

    // ✅ Esperar un poco
    await page.waitForTimeout(2000);

    // ✅ Screenshot DESPUÉS del click
    await page.screenshot({ path: "test-results/after-submit.png" });

    // ✅ Ver todos los elementos con role="alert"
    const alerts = await page.locator('[role="alert"]').allTextContents();
    console.log("🔴 Alerts found:", alerts);

    // ✅ Ver todos los textos que contienen "título"
    const titleErrors = await page.locator("text=/título/i").allTextContents();
    console.log("🔴 Title errors:", titleErrors);

    // ✅ Ver todos los textos que contienen "descripción"
    const descErrors = await page
      .locator("text=/descripción/i")
      .allTextContents();
    console.log("🔴 Desc errors:", descErrors);

    // ✅ Ver el HTML del form
    const formHTML = await page.locator("form").innerHTML();
    console.log("🔴 Form HTML:", formHTML.substring(0, 1000));

    // ✅ Ver si hay errores de validación de Chakra UI
    const chakraErrors = await page.locator("[data-invalid]").allTextContents();
    console.log("🔴 Chakra errors:", chakraErrors);

    // ✅ Ver si la URL cambió (redirect?)
    console.log("🔴 Current URL:", page.url());
  });
});
