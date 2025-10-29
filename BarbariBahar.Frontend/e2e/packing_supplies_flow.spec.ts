import { test, expect } from '@playwright/test';

test('packing supplies flow', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click the "Get a Quote" button on the homepage
  await page.waitForSelector('text=شروع استعلام قیمت', { state: 'visible', timeout: 60000 });
  await page.click('text=شروع استعلام قیمت');
  await page.waitForURL('http://localhost:5173/quote/service-type');

  // Click the "Purchase Packing Supplies" card
  await page.click('text=خرید لوازم بسته‌بندی');
  await page.waitForURL('http://localhost:5173/quote/products');

  // Wait for the product categories to load and click the first one
  await page.waitForSelector('text=کارتن‌ها');
  await page.click('text=کارتن‌ها');

  // Wait for the products to load and add one to the cart
  await page.waitForSelector('text=کارتن سه لایه');
  await page.click('button:has-text("+")');

  // Check that the cart quantity is 1
  await expect(page.locator('span:has-text("1")')).toBeVisible();

  // Add another item
  await page.click('button:has-text("+")');

  // Check that the cart quantity is 2
  await expect(page.locator('span:has-text("2")')).toBeVisible();

  // Remove one item
  await page.click('button:has-text("-")');

  // Check that the cart quantity is 1 again
  await expect(page.locator('span:has-text("1")')).toBeVisible();

  // Click the "Next" button
  await page.click('text=Next');

  // Verify navigation to the details page
  await page.waitForURL('http://localhost:5173/quote/details');
});
