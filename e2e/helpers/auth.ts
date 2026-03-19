import { Page, expect } from "@playwright/test";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@tratolibre.com",
  password: process.env.TEST_USER_PASSWORD ?? "Test1234!",
};

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByTestId("email").fill(TEST_USER.email);
  await page.getByTestId("password").fill(TEST_USER.password);
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL("/");
}

export async function logout(page: Page) {
  await page.goto("/");
  // logout via form action directo
  await page.evaluate(() => {
    const form = document.querySelector(
      'form[action*="logout"]',
    ) as HTMLFormElement;
    form?.submit();
  });
  await expect(page).toHaveURL("/");
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  await page.goto("/");
  return page.url().includes("/login") === false;
}
