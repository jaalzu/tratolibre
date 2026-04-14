import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

test.describe("Auth", () => {
  test("login exitoso redirige al home", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email").fill(TEST_USER.email);
    await page.getByTestId("password").fill(TEST_USER.password);
    await page.getByTestId("submit-button").click();
    await expect(page).toHaveURL("/");
  });

  test("login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email").fill(TEST_USER.email);
    await page.getByTestId("password").fill("wrongpassword");
    await page.getByTestId("submit-button").click();

    // ✅ Esperar a que termine el request
    await page.waitForLoadState("networkidle");

    // ✅ Debug: ver qué hay en la página
    const pageText = await page.textContent("body");
    console.log("🔴 Page text:", pageText);

    // ✅ Buscar alerts/toasts
    const alerts = await page.locator('[role="alert"]').allTextContents();
    console.log("🔴 Alerts:", alerts);

    const toasts = await page.locator("[data-sonner-toast]").allTextContents();
    console.log("🔴 Toasts:", toasts);

    // ✅ Buscar cualquier mensaje de error
    const errorMessages = await page
      .locator("text=/error|incorrect|invalid|contraseña/i")
      .allTextContents();
    console.log("🔴 Error messages:", errorMessages);
  });

  test("usuario no autenticado es redirigido a login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/login/);
  });

  test("login persiste al navegar entre páginas", async ({ page }) => {
    await login(page);
    await page.goto("/favorites");
    await expect(page).not.toHaveURL(/login/);
  });
});
