import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

const SELLER_ITEM_ID = "3f92d4fb-d767-4d19-ba51-9ac325aedf93";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ browser }) => {
    const context = await browser.newContext();
    await context.close();
  });

  test("usuario no autenticado no puede acceder al chat", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/chat");
    await expect(page).toHaveURL(/login/);
    await context.close();
  });

  test("puede navegar al chat desde un item", async ({ page }) => {
    await page.goto(`/item/${SELLER_ITEM_ID}`);
    const btn = page.getByTestId("contact-seller-button").nth(1);
    await expect(btn).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/chat\//, { timeout: 15000 }),
      btn.click(),
    ]);
    await expect(page).toHaveURL(/\/chat\//);
  });

  test("puede ver la bandeja de entrada", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL("/chat");
    await expect(
      page.getByText("Bandeja de entrada").filter({ visible: true }),
    ).toBeVisible();
  });
  test("puede enviar un mensaje", async ({ page }) => {
    await page.goto(`/item/${SELLER_ITEM_ID}`);
    await Promise.all([
      page.waitForURL(/\/chat\//, { timeout: 30000 }),
      page.getByTestId("contact-seller-button").nth(1).click(),
    ]);
    await page
      .getByTestId("chat-input")
      .filter({ visible: true })
      .fill("Hola, me interesa el item");
    await page.getByTestId("send-button").filter({ visible: true }).click();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText("Hola, me interesa el item").last(),
    ).toBeVisible();
  });
});
