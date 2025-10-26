import { test, expect } from '@playwright/test';

test('homepage render successfully', async ({ page }) => {
  // 1. Navigate to the local URL where the application is expected to run
  await page.goto('http://localhost:5173');

  // 2. Get the page title
  const title = await page.title();

  // 3. Assert that the title contains the expected text
  // It is assumed here that the page title contains 'Bahar Truck'.
  expect(title).toContain('Bahar Truck');
});
