import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

const SELLER_ITEM_ID = "e4afd0b6-7df6-4e65-84b2-a09d8d4a8da6";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
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

    // ✅ Esperar a que cargue bien el botón
    const btn = page.getByTestId("contact-seller-button").nth(1);
    await btn.waitFor({ state: "visible", timeout: 60000 });

    // ✅ Click y esperar navegación con timeout más largo
    await btn.click();
    await page.waitForURL(/\/chat\//, { timeout: 60000 }); // ✅ 60s

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

    // ✅ Esperar botón y hacer click
    const btn = page.getByTestId("contact-seller-button").nth(1);
    await btn.waitFor({ state: "visible", timeout: 50000 });
    await btn.click();

    // ✅ Esperar navegación
    await page.waitForURL(/\/chat\//, { timeout: 60000 });

    // ✅ Esperar a que el input esté listo
    const chatInput = page.getByTestId("chat-input").filter({ visible: true });
    await chatInput.waitFor({ state: "visible", timeout: 10000 });

    await chatInput.fill("Hola, me interesa el item");

    const sendBtn = page.getByTestId("send-button").filter({ visible: true });
    await sendBtn.click();

    // ✅ Esperar a que aparezca el mensaje
    await expect(
      page.getByText("Hola, me interesa el item").last(),
    ).toBeVisible({ timeout: 60000 });
  });
});
