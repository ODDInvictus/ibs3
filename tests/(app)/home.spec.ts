import { test, expect } from '@playwright/test';

test('does not redirect to /auth', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // expect to not be redirected to /auth
  await expect(page).toHaveURL(/^((?!auth).)*$/);

  await expect(page).toHaveTitle(/Invictus Bier Systeem/);
});

test('can register for activity', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('button', { name: 'Ik ben 🐝' })).toBeVisible();
  await page.getByRole('button', { name: 'Ik ben 🐝' }).click();
  await expect(page.getByRole('main')).toContainText('Je bent aangemeld voor de activiteit');
})