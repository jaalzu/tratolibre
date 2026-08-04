import { Page } from "@playwright/test";

// e2e/helpers/items.ts
export async function fillAndSubmitItem(
  page: Page,
  overrides: {
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    condition?: string;
    province?: string;
    imagePath?: string;
    /** En qué step detenerse: 0 = solo llenar step 0, 1 = llenar hasta step 1, 2 (default) = llenar todo y submitear */
    stopAtStep?: 0 | 1 | 2;
  } = {},
) {
  const title = overrides.title ?? "Item de test E2E";
  const description =
    overrides.description ??
    "Descripción del item de test para playwright automatizado bien largo.";
  const price = overrides.price ?? "1000";
  const category = overrides.category ?? "tecnologia";
  const condition = overrides.condition ?? "good";
  const province = overrides.province ?? "Buenos Aires";
  const imagePath = overrides.imagePath ?? "e2e/fixtures/test-image.jpg";
  const stopAtStep = overrides.stopAtStep ?? 2;

  // ============================================
  // STEP 0: Detalles (título, descripción, categoría)
  // ============================================
  await page.getByTestId("title").fill(title);
  await page.getByTestId("description").fill(description);

  await page.getByTestId("select-elegí-una...").click();
  await page.getByTestId(`option-${category}`).click();

  if (stopAtStep === 0) return;

  await page.getByTestId("next-step").click();

  // ============================================
  // STEP 1: Precio, condición, ubicación (provincia requerida)
  // ============================================
  await page.getByTestId("sale_price").fill(price);

  await page.getByTestId("select-estado...").click();
  await page.getByTestId(`option-${condition}`).click();

  await page.getByTestId("select-provincia...").click();
  await page.getByRole("button", { name: province }).click();

  if (stopAtStep === 1) return;

  await page.getByTestId("next-step").click();

  // ============================================
  // STEP 2: Fotos (al menos 1 imagen requerida)
  // ============================================
  await page.locator('input[type="file"]').setInputFiles(imagePath);
  await page.waitForSelector('img[alt^="foto-"]');

  await page.getByTestId("submit-item").click();
}

/**
 * Helper específico para llenar solo el step 0, útil para tests
 * que verifican validación sin necesidad de navegar el wizard entero.
 */
export async function fillStepDetails(
  page: Page,
  overrides: { title?: string; description?: string; category?: string } = {},
) {
  if (overrides.title) await page.getByTestId("title").fill(overrides.title);
  if (overrides.description)
    await page.getByTestId("description").fill(overrides.description);
  if (overrides.category) {
    await page.getByTestId("select-elegí-una...").click();
    await page.getByTestId(`option-${overrides.category}`).click();
  }
}
