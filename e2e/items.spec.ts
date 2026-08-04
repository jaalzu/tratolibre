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

  test("no avanza al siguiente step si el primer step tiene errores", async ({
    page,
  }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    const nextButton = page.getByTestId("next-step");
    await nextButton.waitFor({ state: "visible", timeout: 10000 });

    await nextButton.click();

    // El campo de precio (step 1) NO debería estar visible, porque
    // la validación del step 0 tiene que haber bloqueado el avance.
    await expect(page.getByTestId("sale_price")).not.toBeVisible();

    const invalidFields = page.locator("[data-invalid]");
    await expect(invalidFields.first()).toBeVisible({ timeout: 5000 });

    await expect(
      page.getByText("El título debe tener al menos 5 caracteres"),
    ).toBeVisible();
    await expect(page.getByText(/descripción más detallada/i)).toBeVisible();
  });

  test("avanza de step cuando los campos son válidos", async ({ page }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    await fillAndSubmitItem(page, { stopAtStep: 0 });
    await page.getByTestId("next-step").click();

    // Ahora deberíamos estar en el step 1: precio visible
    await expect(page.getByTestId("sale_price")).toBeVisible();
    // Y el campo de título (step 0) ya no debería estar visible
    await expect(page.getByTestId("title")).not.toBeVisible();
  });

  test("completa el formulario correctamente", async ({ page }) => {
    await page.goto("/item/new");
    await page.waitForLoadState("networkidle");

    await page
      .getByTestId("title")
      .waitFor({ state: "visible", timeout: 10000 });

    await fillAndSubmitItem(page, { stopAtStep: 0 });

    await expect(page.getByTestId("title")).toHaveValue("Item de test E2E");

    await page.getByTestId("next-step").click();
    await page.getByTestId("sale_price").fill("1000");

    await expect(page.getByTestId("sale_price")).toHaveValue("1.000");
  });
});
