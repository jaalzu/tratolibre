import { Page } from "@playwright/test";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

export async function login(page: Page) {
  await page.goto("/login");

  // ✅ Esperar que cargue completamente (evita hydration issues)
  await page.waitForLoadState("networkidle");

  await page.getByTestId("email").fill(TEST_USER.email);
  await page.getByTestId("password").fill(TEST_USER.password);

  await page.getByTestId("submit-button").click();

  // ✅ Esperar redirect con strategy más tolerante
  await page.waitForURL("/", {
    timeout: 30000, // ✅ Reducir a 30s
    waitUntil: "domcontentloaded", // ✅ Cambiar de networkidle a domcontentloaded
  });
}

export async function logout(page: Page) {
  await page.goto("/");

  await Promise.all([
    page.waitForURL("/", { timeout: 20000 }),
    page.evaluate(() => {
      const form = document.querySelector(
        'form[action*="logout"]',
      ) as HTMLFormElement;
      form?.submit();
    }),
  ]);
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  await page.goto("/");
  return page.url().includes("/login") === false;
}
