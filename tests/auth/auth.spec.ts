import { test, expect } from '@playwright/test';

test('redirects to /auth', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // expect to be redirected
  await expect(page).toHaveURL(/auth/);

  await expect(page).toHaveTitle(/Invictus Bier Systeem/);
});

// TODO: dit meer testen zodra de interne login werkt