import { Page } from "@playwright/test";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByTestId("email").fill(TEST_USER.email);
  await page.getByTestId("password").fill(TEST_USER.password);

  await Promise.all([
    page.waitForURL("/", { timeout: 10000 }),
    page.getByTestId("submit-button").click(),
  ]);
}

export async function logout(page: Page) {
  await page.goto("/");

  await Promise.all([
    page.waitForURL("/", { timeout: 5000 }),
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
