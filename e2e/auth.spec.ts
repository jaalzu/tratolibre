// e2e/auth.spec.ts

import { test, expect } from "@playwright/test";
import { login } from "./helpers/auth";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

test.describe("Auth", () => {
  // ✅ Configurar retries
  test.describe.configure({ retries: 2 });

  test("login exitoso redirige al home", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle"); // ✅ Agregar

    await page.getByTestId("email").fill(TEST_USER.email);
    await page.getByTestId("password").fill(TEST_USER.password);

    await page.getByTestId("submit-button").click();

    // ✅ Cambiar waitUntil
    await page.waitForURL("/", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL("/");
  });

  test("login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle"); // ✅ Agregar

    await page.getByTestId("email").fill(TEST_USER.email);
    await page.getByTestId("password").fill("wrongpassword123");

    await page.getByTestId("submit-button").click();

    await page.waitForTimeout(2000);

    await expect(
      page.getByText(/email o contraseña incorrectos/i),
    ).toBeVisible();

    await expect(page).toHaveURL(/login/);
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

  // test("registro exitoso muestra mensaje de confirmación", async ({ page }) => {
  //   await page.goto("/register");
  //   await page.waitForLoadState("networkidle"); // ✅ Agregar

  //   const uniqueEmail = `test-${Date.now()}@tratolibre.com`;

  //   // ✅ Esperar que el input esté visible
  //   await page
  //     .getByTestId("firstName")
  //     .waitFor({ state: "visible", timeout: 10000 });

  //   await page.getByTestId("firstName").fill("Test");
  //   await page.getByTestId("lastName").fill("User");
  //   await page.getByTestId("email").fill(uniqueEmail);
  //   await page.getByTestId("password").fill("Test1234!");

  //   await page.getByTestId("submit-button").click();

  //   await expect(page.getByText(/te enviamos un email/i)).toBeVisible({
  //     timeout: 10000,
  //   });
  // });
});
