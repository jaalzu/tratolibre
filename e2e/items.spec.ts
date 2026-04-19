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

    const invalidFields = page.locator("[data-invalid]");
    await expect(invalidFields.first()).toBeVisible({ timeout: 5000 });

    const errorCount = await page.locator('[data-part="error-text"]').count();
    expect(errorCount).toBeGreaterThanOrEqual(2);

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

    await fillAndSubmitItem(page, { submit: false });

    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E");
    await expect(page.getByTestId("sale_price")).toHaveValue("1.000");
  });

  test("DEBUG: muestra errores si se envía el form vacío", async ({ page }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    const submitButton = page.getByTestId("submit-item");
    await submitButton.waitFor({ state: "visible", timeout: 10000 });

    await page.screenshot({ path: "test-results/before-submit.png" });

    await submitButton.click();

    await page.waitForTimeout(2000);

    await page.screenshot({ path: "test-results/after-submit.png" });

    const alerts = await page.locator('[role="alert"]').allTextContents();

    const titleErrors = await page.locator("text=/título/i").allTextContents();

    const descErrors = await page
      .locator("text=/descripción/i")
      .allTextContents();

    const formHTML = await page.locator("form").innerHTML();

    const chakraErrors = await page.locator("[data-invalid]").allTextContents();
  });
});
