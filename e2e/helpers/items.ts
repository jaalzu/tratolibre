import { Page, expect } from "@playwright/test";

export async function fillAndSubmitItem(
  page: Page,
  overrides: {
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    condition?: string;
  } = {},
) {
  const title = overrides.title ?? "Item de test E2E";
  const description =
    overrides.description ??
    "Descripción del item de test para playwright automatizado bien largo.";
  const price = overrides.price ?? "1000";
  const category = overrides.category ?? "tecnologia";
  const condition = overrides.condition ?? "good";

  await page.getByTestId("title").fill(title);
  await page.getByTestId("description").fill(description);
  await page.getByTestId("sale_price").fill(price);

  // Categoría
  await page.getByTestId("select-elegí-una...").click();
  await page.getByTestId(`option-${category}`).click();

  // Condición
  await page.getByTestId("select-estado...").click();
  await page.getByTestId(`option-${condition}`).click();
  await page.getByTestId("submit-item").click();
}

export async function deleteCurrentItem(page: Page) {
  await page.getByTestId("delete-item-button").click();
  await page.getByTestId("confirm-button").click();
  await expect(page).toHaveURL("/");
}
