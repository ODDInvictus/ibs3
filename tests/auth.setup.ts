import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');

  // Volg authentik
  await page.getByRole('button', { name: 'Login met Authentik' }).click();
  await page.getByPlaceholder('Email or Username').fill('username');
  await page.getByPlaceholder('Email or Username').press('Enter');
  await page.getByPlaceholder('Please enter your password').fill('password');
  await page.getByPlaceholder('Please enter your password').press('Enter');

  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('http://localhost:5173/');

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});