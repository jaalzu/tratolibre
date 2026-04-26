// e2e/debug-login.spec.ts

import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

test("DEBUG - ver qué pasa en el login", async ({ page }) => {
  // Capturar errores de consola
  page.on("console", (msg) => {});

  // Capturar requests fallidos
  page.on("requestfailed", (request) => {});

  await page.goto("/login");

  // Screenshot inicial
  await page.screenshot({ path: "test-results/01-login-page.png" });

  await page.getByTestId("email").fill(TEST_USER.email);

  await page.getByTestId("password").fill(TEST_USER.password);

  // Screenshot antes de submit
  await page.screenshot({ path: "test-results/02-before-submit.png" });

  await page.getByTestId("submit-button").click();

  // Esperar 3 segundos para ver qué pasa
  await page.waitForTimeout(3000);

  // Screenshot después de submit
  await page.screenshot({ path: "test-results/03-after-submit.png" });

  // Ver URL actual
  const currentURL = page.url();

  // Ver si hay mensaje de error
  const errorText = await page
    .locator("text=/error|incorrect|invalid|contraseña/i")
    .allTextContents();
  if (errorText.length > 0) {
    console.log("❌ Errores encontrados:", errorText);
  }

  // Ver TODO el HTML
  const bodyText = await page.locator("body").textContent();
});
